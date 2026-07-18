'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Node-and-edge schematic.
 *
 * Genuinely 3D — points live in a volume and are perspective-projected each
 * frame — but drawn as flat circles and hairlines, because the reference is
 * line art, not a lit scene. Rotation gives depth; shading would break it.
 *
 * The nodes are abstract. They are not holdings and must never be labelled or
 * counted, because there is nothing yet to point at.
 */

const FOV = 900;

type Point = { x: number; y: number; z: number };
type Projected = { x: number; y: number; s: number };

/** Deterministic RNG so the constellation is stable across reloads. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s >>> 8) / 16777216;
  };
}

type Shape = {
  clusters: number;
  perCluster: number;
  strays: number;
  neighbours: number;
};

function build(seed: number, shape: Shape) {
  const rand = rng(seed);
  const points: Point[] = [];

  // Cluster centres are spread across the full width in bands rather than
  // sampled from a centred distribution — random centres left ~30% of the
  // field empty on each flank, which read as a failed render.
  const MIN_GAP = 46; // keeps markers from overlapping into blobs
  const tooClose = (x: number, y: number, z: number) =>
    points.some(
      (p) =>
        (p.x - x) ** 2 + (p.y - y) ** 2 + (p.z - z) ** 2 < MIN_GAP * MIN_GAP
    );

  const place = (x: number, y: number, z: number) => {
    if (tooClose(x, y, z)) return;
    points.push({ x, y, z });
  };

  for (let c = 0; c < shape.clusters; c++) {
    // band c across the width, with a margin so arcs cannot run off the edge
    const band = (c + 0.5) / shape.clusters;
    const cx = (band - 0.5) * 1180 + (rand() - 0.5) * 130;
    const cy = (rand() - 0.5) * 470;
    const cz = (rand() - 0.5) * 380;
    place(cx, cy, cz);
    for (let i = 0; i < shape.perCluster; i++) {
      place(
        cx + (rand() - 0.5) * 210,
        cy + (rand() - 0.5) * 210,
        cz + (rand() - 0.5) * 170
      );
    }
  }
  for (let i = 0; i < shape.strays; i++) {
    place((rand() - 0.5) * 1240, (rand() - 0.5) * 560, (rand() - 0.5) * 420);
  }

  // k-nearest edges, deduped by sorted key
  const seen = new Set<string>();
  const edges: Array<[number, number]> = [];
  points.forEach((p, i) => {
    const near = points
      .map((q, j) => ({ j, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 + (p.z - q.z) ** 2 }))
      .filter((n) => n.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, shape.neighbours);
    near.forEach(({ j }) => {
      const key = i < j ? `${i}:${j}` : `${j}:${i}`;
      if (seen.has(key)) return;
      seen.add(key);
      edges.push([i, j]);
    });
  });

  return { points, edges };
}

function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Canvas 2D does not resolve CSS custom properties — an unparseable fillStyle
 * silently falls back to black — so var() has to be resolved against the
 * element before it reaches the context.
 */
function resolve(color: string, el: Element, fallback = '#7fb2e8'): string {
  const match = color.match(/^var\((--[\w-]+)\)$/);
  if (!match) return color;
  // NOT `|| color`: handing back the unresolved "var(--x)" string means an
  // invalid fillStyle, which the spec tells the canvas to ignore — leaving the
  // previous value, i.e. black. The fallback has to be a real colour.
  return getComputedStyle(el).getPropertyValue(match[1]).trim() || fallback;
}

type Props = {
  /** node fill */
  node: string;
  /** edge stroke */
  edge: string;
  /** 'dot' = filled circles, 'square' = outlined squares */
  marker?: 'dot' | 'square';
  /** bow the edges instead of drawing them straight */
  arcs?: boolean;
  seed?: number;
  className?: string;
} & Partial<Shape>;

export default function NodeField({
  node,
  edge,
  marker = 'dot',
  arcs = false,
  seed = 7,
  clusters = 5,
  perCluster = 4,
  strays = 4,
  neighbours = 2,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const { points, edges } = build(seed, { clusters, perCluster, strays, neighbours });
    const nodeColor = resolve(node, canvas);
    const edgeColor = resolve(edge, canvas);
    const flat: Projected[] = points.map(() => ({ x: 0, y: 0, s: 1 }));

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let t = 0;
    /** scroll progress across this plate, 0..1, lerped toward by the loop */
    let scrollTarget = 0;
    let scrollEased = 0;
    let reveal = reduced ? 1 : 0; // 0..1 draw-on
    let visible = false;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function project(
      p: Point,
      cosY: number,
      sinY: number,
      cosX: number,
      sinX: number,
      out: Projected
    ): Projected {
      // rotate Y, then X
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;
      const y1 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      const scale = FOV / (FOV + z2);
      // fit the volume to the shorter axis so it never crops
      const fit = Math.min(w * 0.62, h) / 620;
      out.x = w / 2 + x1 * scale * fit;
      out.y = h / 2 + y1 * scale * fit;
      out.s = scale;
      return out;
    }

    function frame() {
      // A slow ambient drift plus a scroll term. The drift alone made the
      // diagram look like a screensaver; scroll alone made it dead when still.
      if (!reduced) t += 0.0004;
      scrollEased += (scrollTarget - scrollEased) * 0.08;
      if (Math.abs(scrollTarget - scrollEased) < 0.0002) scrollEased = scrollTarget;
      if (reveal < 1 && visible) reveal = Math.min(1, reveal + 0.012);

      const ay = t + scrollEased * 0.9;
      const ax = Math.sin(t * 0.6) * 0.1 + scrollEased * 0.18;
      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);
      const cosX = Math.cos(ax);
      const sinX = Math.sin(ax);
      const shown = easeOutExpo(reveal);

      ctx!.clearRect(0, 0, w, h);

      // projected into a preallocated buffer — mapping allocated a fresh array
      // of objects every frame, on two instances, for the GC to sweep
      for (let i = 0; i < points.length; i++) {
        project(points[i], cosY, sinY, cosX, sinX, flat[i]);
      }

      // edges first, so nodes sit on top
      ctx!.strokeStyle = edgeColor;
      ctx!.lineWidth = 1;
      const edgeCount = Math.floor(edges.length * shown);
      for (let i = 0; i < edgeCount; i++) {
        const [a, b] = edges[i];
        ctx!.globalAlpha = 0.55 * Math.min(flat[a].s, flat[b].s);
        ctx!.beginPath();
        ctx!.moveTo(flat[a].x, flat[a].y);
        if (arcs) {
          // bow perpendicular to the chord — quotes the sweeping arcs of the
          // black reference plate without becoming a different vocabulary
          const mx = (flat[a].x + flat[b].x) / 2;
          const my = (flat[a].y + flat[b].y) / 2;
          const dx = flat[b].x - flat[a].x;
          const dy = flat[b].y - flat[a].y;
          ctx!.quadraticCurveTo(mx - dy * 0.18, my + dx * 0.18, flat[b].x, flat[b].y);
        } else {
          ctx!.lineTo(flat[b].x, flat[b].y);
        }
        ctx!.stroke();
      }

      // nodes are drawn in full from the start; only edges reveal. Advancing
      // both against different denominators left lines hanging at nodes that
      // had not appeared yet.
      for (let i = 0; i < points.length; i++) {
        const f = flat[i];
        const r = 5.5 * f.s;
        ctx!.globalAlpha = Math.min(1, f.s);
        if (marker === 'square') {
          ctx!.strokeStyle = nodeColor;
          ctx!.lineWidth = 1;
          ctx!.strokeRect(f.x - r, f.y - r, r * 2, r * 2);
        } else {
          ctx!.fillStyle = nodeColor;
          ctx!.beginPath();
          ctx!.arc(f.x, f.y, r, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      ctx!.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(frame);
    }

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      // reduced motion draws once, so a resize has to redraw explicitly
      if (reduced) frame();
    });
    ro.observe(canvas);

    // A frozen animation that still schedules 60 identical frames a second is
    // not reduced motion. Draw the settled state once and stop.
    if (reduced) {
      frame();
      return () => {
        ro.disconnect();
      };
    }

    const spin = ScrollTrigger.create({
      trigger: canvas,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        scrollTarget = self.progress;
      },
    });

    // only animate while on screen
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !running && !reduced) {
          running = true;
          raf = requestAnimationFrame(frame);
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      spin.kill();
      ro.disconnect();
      io.disconnect();
    };
  }, [node, edge, marker, arcs, seed, clusters, perCluster, strays, neighbours]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
