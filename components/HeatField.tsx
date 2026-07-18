'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Posterised heat field.
 *
 * A continuous Float32 scalar field on a fixed-pixel lattice, quantised into
 * hard colour bands. The banding is the entire aesthetic — a smooth-gradient
 * version of this reads as nothing. The pointer injects heat, so the field is
 * live rather than decorative.
 *
 * `threshold` is the bridge to the rest of the site: raising it starves the
 * field until only sparse isolated cells survive, and those survivors are the
 * nodes of the schematic diagrams on later plates. Mosaic and constellation
 * are two states of one mechanism, not two motifs.
 */

const CELL = 9; // px, fixed in screen space — density stays constant as the viewport grows
const BRUSH = 10; // pointer heat radius, in cells
const RELAX = 0.055; // how fast the field chases its target
const DIFFUSE = 0.045; // neighbour bleed — kept low, or bands fuse into smooth contours
const COOL = 0.94; // pointer heat decay per frame
const FREQ = 0.052; // noise frequency; higher = finer structure
/** Static per-cell dither. This is what breaks band edges into individual
 *  surviving cells instead of clean contour lines — the speckled dissolve. */
const GRAIN = 0.17;
/** frames of relaxation to run when settling a single static frame */
const SETTLE_STEPS = 90;

type Band = [number, [number, number, number]];

/** Cool → hot. Below the first cut the cell is unpainted (ground shows through). */
const PALETTES = {
  /* Plate 01 — the full field, on paper.
     The lowest band always covers the most area, so whatever sits there sets
     the weight of the whole composition. Ink in that slot made the field read
     as a black mass with orange on top — heavy, and it fought the type below.
     Sky carries the mass instead; signal is rationed by a high cut. */
  paper: [
    [0.3, [0x7f, 0xb2, 0xe8]], // sky    — the mass, and the dissolve at the edges
    [0.5, [0x1e, 0x2e, 0xdc]], // cobalt — structure
    [0.86, [0xe0, 0x49, 0x2a]], // signal — hot cores, ~2% of painted cells
  ],
  /* Plate 08 — the same field starved, on cobalt. Reads as the survivors of
     plate 01 rather than a new motif. */
  cobalt: [
    [0.3, [0x7f, 0xb2, 0xe8]], // sky
    [0.52, [0xef, 0xed, 0xea]], // paper
    [0.72, [0xe0, 0x49, 0x2a]], // signal
  ],
  // `satisfies` rather than an annotation: `Record<string, Band[]>` would widen
  // keyof to `string`, so a typo'd palette name would typecheck and then crash.
} satisfies Record<string, Band[]>;

type Palette = keyof typeof PALETTES;

/* ---- cheap deterministic value noise ---- */

/**
 * Integer bit-mixing hash. Sine hashing is a GPU-shader idiom — on a CPU
 * `Math.sin` is one of the most expensive scalar ops available, and its low
 * bits differ between JS engines, so "deterministic" noise was not actually
 * reproducible across browsers. This is ~10-20x faster and genuinely stable.
 */
function hash(x: number, y: number): number {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

function noise2(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return (a + (b - a) * xf) * (1 - yf) + (c + (d - c) * xf) * yf;
}

/** Four octaves, drifting on t so the cloud churns rather than pulses. */
function fbm(x: number, y: number, t: number): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < 4; i++) {
    sum += amp * noise2(x * freq + t * (0.6 + i * 0.35), y * freq - t * 0.22);
    amp *= 0.5;
    freq *= 2.05;
  }
  return sum;
}

type Props = {
  /** 0 = full mass, 1 = starved to nothing. */
  threshold?: number;
  /** how much scroll progress across this sheet adds to the threshold, so the
   *  field decays as you leave it. 0 disables. */
  decayOnScroll?: number;
  palette?: Palette;
  className?: string;
};

export default function HeatField({
  threshold = 0,
  decayOnScroll = 0,
  palette = 'paper',
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const thresholdRef = useRef(threshold);
  // written per-frame by ScrollTrigger; deliberately not React state, because
  // re-rendering a canvas host 60x/second is pure waste
  const scrollRef = useRef(0);
  const decayRef = useRef(decayOnScroll);

  // mutating a ref during render is unsafe under concurrent rendering — a
  // render React later discards would still have written to it
  useEffect(() => {
    thresholdRef.current = threshold;
  }, [threshold]);

  useEffect(() => {
    decayRef.current = decayOnScroll;
  }, [decayOnScroll]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bands: readonly Band[] = PALETTES[palette];
    const floor = bands[0][0];

    let cols = 0;
    let rows = 0;
    let heat = new Float32Array(0);
    let pointer = new Float32Array(0);
    /** ramp(x,y) — static per cell, precomputed rather than recomputed 60x/sec */
    let shape = new Float32Array(0);
    /** static per-cell dither, likewise */
    let grain = new Float32Array(0);
    let grid: ImageData | null = null;
    let raf = 0;
    let running = false;
    let visible = false;
    let t = 0;

    // pointer position in cell coordinates; -1 means absent
    let px = -1;
    let py = -1;
    // cached so pointermove never forces a synchronous layout
    let rect = canvas.getBoundingClientRect();

    /**
     * Mass concentrated upper-left, dissolving toward the lower edge so the
     * headline below sits on clean ground. The exponent keeps the boundary
     * from reading as a straight line.
     */
    function rampAt(cx: number, cy: number, w: number, h: number): number {
      const diagonal = 1 - ((cx / w) * 0.42 + (cy / h) * 0.62);
      return Math.max(0, diagonal) ** 1.35 * 1.9;
    }

    function resize(): void {
      rect = canvas!.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // no `+1`: the canvas is stretched across the box, not tiled, so an extra
      // column only makes the effective cell size viewport-dependent
      const nextCols = Math.max(1, Math.round(rect.width / CELL));
      const nextRows = Math.max(1, Math.round(rect.height / CELL));
      if (nextCols === cols && nextRows === rows) return;

      // Carry the simulation across the resize. Reallocating blind zeroed the
      // field and, at RELAX 0.055, produced a visible ~40-frame flash — which
      // fired on every iOS address-bar show/hide because the sheet is sized in svh.
      const prevHeat = heat;
      const prevCols = cols;
      const prevRows = rows;

      cols = nextCols;
      rows = nextRows;
      heat = new Float32Array(cols * rows);
      pointer = new Float32Array(cols * rows);
      shape = new Float32Array(cols * rows);
      grain = new Float32Array(cols * rows);

      if (prevCols && prevRows) {
        const copyCols = Math.min(prevCols, cols);
        const copyRows = Math.min(prevRows, rows);
        for (let y = 0; y < copyRows; y++) {
          heat.set(
            prevHeat.subarray(y * prevCols, y * prevCols + copyCols),
            y * cols
          );
        }
      }

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          shape[i] = rampAt(x, y, cols, rows);
          grain[i] = (hash(x, y) - 0.5) * GRAIN;
        }
      }

      grid = ctx!.createImageData(cols, rows);
      // one device pixel per cell, then upscaled with smoothing off
      canvas!.width = cols;
      canvas!.height = rows;
    }

    /** One simulation tick. `paint` false advances state without drawing. */
    function advance(paint: boolean): void {
      if (!grid || !cols || !rows) return;

      const cut = thresholdRef.current + scrollRef.current;
      const data = grid.data;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;

          const target = shape[i] * fbm(x * FREQ, y * FREQ, t);

          // neighbour bleed
          const l = x > 0 ? heat[i - 1] : heat[i];
          const r = x < cols - 1 ? heat[i + 1] : heat[i];
          const u = y > 0 ? heat[i - cols] : heat[i];
          const d = y < rows - 1 ? heat[i + cols] : heat[i];
          const blur = (l + r + u + d) * 0.25;

          let v = heat[i] + (target - heat[i]) * RELAX;
          v += (blur - v) * DIFFUSE;
          heat[i] = v;

          if (!paint) continue;

          pointer[i] *= COOL;
          const value = v + pointer[i] - cut + grain[i];

          // ---- posterise ----
          const o = i * 4;
          if (value < floor) {
            data[o + 3] = 0; // unpainted, ground shows through
            continue;
          }
          let band = 0;
          for (let b = bands.length - 1; b >= 0; b--) {
            if (value >= bands[b][0]) {
              band = b;
              break;
            }
          }
          const [cr, cg, cb] = bands[band][1];
          data[o] = cr;
          data[o + 1] = cg;
          data[o + 2] = cb;
          data[o + 3] = 255;
        }
      }

      if (paint) ctx!.putImageData(grid, 0, 0);
    }

    function injectPointer(): void {
      if (px < 0 || !cols || !rows) return;
      const r2 = BRUSH * BRUSH;
      const x0 = Math.max(0, Math.floor(px - BRUSH));
      const x1 = Math.min(cols - 1, Math.ceil(px + BRUSH));
      const y0 = Math.max(0, Math.floor(py - BRUSH));
      const y1 = Math.min(rows - 1, Math.ceil(py + BRUSH));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const dx = x - px;
          const dy = y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 > r2) continue;
          const falloff = 1 - Math.sqrt(d2) / BRUSH;
          const i = y * cols + x;
          pointer[i] = Math.max(pointer[i], falloff * falloff * 0.95);
        }
      }
    }

    function step(): void {
      injectPointer();
      t += 0.0042;
      advance(true);
      raf = requestAnimationFrame(step);
    }

    function start(): void {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(step);
    }

    function stop(): void {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    }

    /** Reduced motion gets one settled frame and no loop at all — not a frozen
     *  animation that still burns a rAF and still reacts to the cursor. */
    function settle(): void {
      for (let i = 0; i < SETTLE_STEPS - 1; i++) advance(false);
      advance(true);
    }

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) settle();
    });
    ro.observe(canvas);

    if (reduced) {
      settle();
    } else {
      // off-screen plates should cost nothing; without this both fields ran
      // their full inner loop for the entire length of the page
      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible) start();
          else stop();
        },
        { threshold: 0 }
      );
      io.observe(canvas);

      // pointer bound to the canvas, not window: two fields exist on this page
      // and a window listener fed each of them the other's coordinates
      const onMove = (e: PointerEvent) => {
        px = (e.clientX - rect.left) / CELL;
        py = (e.clientY - rect.top) / CELL;
      };
      const onLeave = () => {
        px = -1;
        py = -1;
      };
      const finePointer = window.matchMedia('(pointer: fine)').matches;
      if (finePointer) {
        canvas.addEventListener('pointermove', onMove, { passive: true });
        canvas.addEventListener('pointerleave', onLeave);
      }

      // rect is cached, so it has to be refreshed when the page scrolls
      const onScroll = () => {
        rect = canvas.getBoundingClientRect();
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      let trigger: ScrollTrigger | undefined;
      if (decayRef.current > 0) {
        trigger = ScrollTrigger.create({
          trigger: canvas,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            scrollRef.current = self.progress * decayRef.current;
          },
        });
      }

      return () => {
        stop();
        io.disconnect();
        ro.disconnect();
        trigger?.kill();
        canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('scroll', onScroll);
      };
    }

    return () => {
      stop();
      ro.disconnect();
    };
  }, [palette]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      /* absolute so the canvas' intrinsic aspect ratio (from its width/height
         attributes) can't inflate the grid row it sits in */
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        imageRendering: 'pixelated',
      }}
    />
  );
}
