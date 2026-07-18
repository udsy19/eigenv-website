# The Plate System

A design system for building **poster-series websites**: sites that read as a
sequence of printed plates rather than a scrolling page. Swiss-technical,
editorially typeset, with one live generative field carrying the motion budget.

This document is written to be **project-agnostic**. Everything specific to a
brand lives in §2 (Palette) and §12 (Adaptation). Everything else transfers
unchanged.

Read §14 first if you want the short version.

---

## 0. Origin and provenance

The system synthesises three sources. Knowing which is which matters, because
two are real work and one is not.

| Source | What it contributed | Status |
|---|---|---|
| A cobalt "science poster" | Serif/mono split, node schematics, ticket-stub footers, caption blocks | **AI-generated.** No designer, no series, nothing to credit or avoid |
| The Quartr poster series | Black ground, outlined square nodes, sweeping arcs | Real. In-house work by Quartr's co-founder |
| [craft.wild.as](https://craft.wild.as) (studio: wild, Vienna) | The posterised heat-field technique: fixed-pixel lattice, hard colour bands, pointer as heat source | **Real studio work.** Technique learned from; palette, copy and code are theirs |

The provenance check that settled the first row: every verbatim string on the
poster returned zero search hits, and its own printed call-to-action URL was a
404. Worth repeating on any reference you cannot attribute — a real published
poster leaves *some* trace.

**Rule that follows:** take techniques, never palettes-plus-copy-plus-code. A
generative method is a method. A studio's colour and voice are theirs.

---

## 1. The governing idea

> **A dense field resolves into a sparse structure.**

One mechanism, two visible states:

- **Mosaic state** — every cell painted. Dense, churning, hot.
- **Schematic state** — the threshold rises, almost everything decays, and the
  isolated survivors read as nodes with edges between them.

They are not two motifs glued together. They are one scalar field at two
threshold values. This matters practically: the transition between them is a
single animated uniform, not a scene swap.

**When adapting to a new brand, replace the metaphor, keep the mechanism.**
Density→sparsity can mean selection, distillation, focus, signal-from-noise,
survivorship. It should mean *something* in the brand's argument, or it becomes
decoration and the whole system collapses into pastiche.

### 1.1 The honesty constraint

Diagrams that look like data will be read as data.

If a node graph appears on a site for a company with no portfolio, no customers,
or no track record, visitors read the nodes as holdings and the site quietly
contradicts its own copy. Choose one before you build:

1. **Abstract and unlabelled** — few nodes, never captioned, never counted.
   The caption should say so out loud: *"Diagram is illustrative and not to
   scale. Node positions carry no ordinal meaning."*
2. **Bound to something true** — nodes are disciplines, stages, or principles
   that genuinely exist today.

Never label a node with a real entity name unless that entity is real and
current. This is cheap to honour up front and expensive to retrofit.

---

## 2. Palette

Five values. The discipline is the design.

```css
:root {
  --paper:    #efedea;  /* warm ground. Not #fff — white reads clinical  */
  --ink:      #0a0a0a;  /* type and the coolest field band               */
  --cobalt:   #1e2edc;  /* the saturated field colour                    */
  --sky:      #7fb2e8;  /* nodes, edges, accent on dark grounds          */
  --signal:   #e0492a;  /* hot core only. ~2% of pixels, ever            */
  --surround: #e5e5e5;  /* the desk the plates sit on                    */
}
```

### Rules

- **Never introduce a sixth hue.** If something needs distinguishing, use
  position, weight, or rule-work — not another colour.
- `--signal` is a *rationed* colour. It marks the hottest cells in the field and
  occasionally one word of type. If it appears in navigation, buttons, and
  headings, it stops meaning anything.
- `--surround` is deliberately colder and greyer than `--paper`. The contrast
  between them is what makes plates read as objects lying on a surface.
- Grounds and figures come in fixed pairs (§4.2). Do not improvise new pairs.

### Reference palettes for calibration

wild's heat ramp, if you want a wider band table:
`#0a0a0a` → `#1c2541` → `#3b5bd9` → `#f5c518` → `#e0492a` → `#d8ff00`

Note their cobalt `#3b5bd9` and the poster's `#1e2edc` are close by accident.
That coincidence is what let the mosaic and the schematic share a system at all.

---

## 3. Type

### 3.1 Three faces, three jobs, no overlap

| Role | Face | Setting | Substitutes |
|---|---|---|---|
| **Display** | Instrument Serif 400 | `-0.02em`, `line-height: 0.92` | Newsreader (variable `opsz`), Zodiak, Bodoni Moda |
| **Metadata** | Geist Mono 400 | uppercase, `+0.08em`, 11px | Commit Mono, Spline Sans Mono, DM Mono |
| **Body** | Inter | 17–20px, `line-height: 1.55` | Instrument Sans, Source Serif 4 |

All OFL. Self-host WOFF2, latin subset.

**Geist Mono is the load-bearing choice.** It cites ABC Diatype Mono as an
influence and has a neutral Swiss skeleton. Avoid JetBrains Mono, Space Mono,
and Azeret Mono — they read as developer-tool or retro-typewriter faces and
will drag the whole page toward a startup landing page.

If you need optical sizing (type that must look correct at both 12px and 140px),
swap Instrument Serif for **Newsreader** and set `font-optical-sizing: auto`.

### 3.2 Scale

```css
.display  { font-size: clamp(2.5rem, 6.4vw, 6.25rem);  max-width: 15ch; }
.quiet    { font-size: clamp(1.75rem, 4.4vw, 4rem);    max-width: 20ch; }
.lede     { font-size: clamp(1.0625rem, 1.5vw, 1.4375rem); max-width: 40ch; }
.body     { font-size: clamp(1.0625rem, 1.35vw, 1.3125rem); }
.caption  { font-size: 0.8125rem; line-height: 1.45;   max-width: 32ch; }
.meta     { font-size: 0.6875rem; letter-spacing: 0.08em; text-transform: uppercase; }
```

### 3.3 Non-negotiable details

- `font-variant-numeric: tabular-nums` **globally**. Columns of figures snapping
  to a grid is load-bearing for the document read.
- Negative tracking (−0.02 to −0.04em) **only above ~48px**. Never on body text
  of the same family.
- Mono gets **positive** tracking (+3 to +8%) at caption sizes.
- Display type is set **lowercase where the sentence allows** and always ranged
  left. Never centred, never all-caps.
- One sentence per display line. If it wraps to four lines, the sentence is too
  long or the size is too large — fix the copy first.

### 3.4 Duotone

The system's one emphasis mechanism.

```css
.words em { font-style: normal; color: var(--accent); }
```

A second sentence, or a clause carrying the turn in the argument, switches
**colour** — not opacity, not weight, not italic.

This matters more than it sounds. Faded grey reads as *"this is less
important."* An accent colour reads as *"this is the other half of the claim."*
For copy where the second sentence is the differentiator — which is most good
copy — opacity actively works against the writing.

`--accent` is per-plate (§4.2), so the same rule works on every ground.

---

## 4. The plate

### 4.1 Anatomy

Every plate is the same four-row grid. The consistency is what makes a *series*.

```
┌─ sheet ─────────────────────────────────────────────┐
│  caption      caption               META RIGHT      │  auto
│                                     META RIGHT      │
│                                                     │
│  ░░▓▓██  the visual, full-bleed to sheet edge  ██▓░ │  1fr
│                                                     │
│  Display type, ranged left, bottom of composition   │  auto
│  Accent-coloured second voice                       │  auto
│  ┌─────────┬──────────┬─────────┐                   │
│  │ STUB    │ STUB     │ STUB    │  ticket table     │  auto
│  └─────────┴──────────┴─────────┘                   │
└─────────────────────────────────────────────────────┘
```

```css
.sheet {
  margin: clamp(0.75rem, 1.6vw, 1.75rem);
  min-height: calc(100svh - var(--sheet-margin) * 2);
  padding: clamp(1.5rem, 2.6vw, 2.75rem);
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  gap: clamp(1.25rem, 2.4vw, 2.25rem);
  overflow: hidden;
  background: var(--ground);
  color: var(--figure);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.06), 0 12px 34px rgb(0 0 0 / 0.09);
}
```

The margin plus the shadow is the entire trick that makes a web page read as a
printed object. Do not remove either.

**The visual bleeds past the sheet padding** via negative inline margin. Type
never does. That asymmetry — image to the edge, type inset — is a print
convention and it is most of why the layout looks typeset rather than templated.

### 4.2 Ground / figure / accent triples

Fixed. Do not improvise.

| Ground | Figure | Accent |
|---|---|---|
| `--paper` | `--ink` | `--cobalt` |
| `--cobalt` | `--paper` | `--sky` |
| `--ink` | `--paper` | `--sky` |

### 4.3 Plate height, and the negative-space trap

**The single biggest failure mode of this system is dead air.**

A plate forced to `min-height: 100svh` with only a heading and a diagram in it
produces large empty regions above and below the material. It reads as
unfinished rather than confident.

The rule:

| Plate type | Height |
|---|---|
| Full-bleed generative visual (hero) | `min-height: 100svh` |
| Content in the middle band (lists, tables, prose) | **`min-height: 0`** — size to content |
| Short plates (contact) | `min-height: 0`, visual band reduced to ~14svh |

And set the content slot to `align-self: start`, not `center`. Centring in a
`1fr` row is what pushes gaps to both ends.

Applying this took one reference plate from 854px to 618px with no content
removed — the air was the whole difference.

**The right way to fill a plate is more material, not more ornament.** A ruled
index of six services, a four-up comparison table, a proportional schedule bar —
these fill space because they carry information. Decorative elements added to
fill space are exactly what destroys this aesthetic.

### 4.4 Content structures that fill honestly

Each is a distinct visual vocabulary, so using several across a series also
satisfies §5.

**Ruled index** — numbered rows, `3rem | 1.9fr | 1fr` grid, 1px rules between.
Index in accent mono, name in serif, body in sans, outcome in the right column.
Best structure in the system for six-or-fewer parallel items.

**Four-up table** — equal columns with full 1px borders on all sides, built from
`border-top` + `border-left` on the container and `border-right` +
`border-bottom` on cells. Reads as a specimen table.

**Proportional schedule bar** — phases as `Nfr` grid columns so widths encode
duration. `gap: 1px` over a `currentColor` background makes the gaps *become*
the dividing rules, which is cheaper and crisper than borders.

**Spec columns** — `repeat(auto-fit, minmax(13rem, 1fr))` with a rule above each
group. Tune the minimum so all groups fit one row: a lone orphan group on a
second row reads as a layout accident.

**Bordered form** — inputs with `border-bottom` only, transparent background,
inherited font. Use an **explicit** column count, not `auto-fit` — a textarea
sharing an auto-fit row with short inputs drags their baselines apart.

### 4.5 Masthead and footer

The plate series alone is not a website.

**Masthead** — sticky, on the surround, hairline bottom rule. The wordmark set
in mono caps at `clamp(1.0625rem, 1.7vw, 1.5rem)` with `0.16em` tracking.

> The company name must be the first thing the eye lands on. Burying it in the
> corner metadata block alongside a city name is a real failure — metadata reads
> as furniture, and the brand gets skipped.

Set `scroll-padding-top` on `html` so anchor jumps clear the sticky bar.

**Footer** — a real footer on `--ink`, not another plate. Wordmark plus tagline,
three or four link columns with accent-coloured mono headings, and a bottom bar
divided by a hairline carrying person, email, location, copyright. Its job is to
make the series visibly *end*.

### 4.6 The furniture

Three recurring elements sell "document" harder than any image:

**Mono metadata**, pinned top-right, 2–3 lines, always including a plate number:

```
EIGENV
SAN FRANCISCO, CALIFORNIA
PLATE 01 / 06
```

Pin it to the **last grid column explicitly** (`grid-column: 3`). If you let it
flow, a plate with one caption instead of two will land it in the wrong column.

**Caption blocks**, top-left, 1–2 short columns — and **optional**. This is the
element most likely to fill with noise, because the slot invites filling.

A caption earns its place only by carrying information found nowhere else on
the plate. Three failure modes, all of which look plausible while writing:

1. **Restating the metadata.** A caption opening "Schematic, plate six" beside a
   mono block reading `PLATE 06 / 08` is pure duplication. Never number a plate
   in prose; the metadata block already does.
2. **Disclaiming a risk nobody has.** *"Diagram is illustrative; node positions
   carry no ordinal meaning"* protects against a misreading no visitor was
   going to make. The honesty constraint (§1.1) is discharged by *not labelling
   nodes*, not by a disclaimer. Only write the disclaimer where the diagram
   genuinely could be mistaken for data.
3. **Narrating the obvious.** "Four seats at the same table" above four labelled
   cards tells the reader what they can already see.

Delete rather than fill. A plate with no caption is normal — in the reference
build only four of eight carry one. The ones that survived all state a real
constraint or fact:

> *"What we ask of you: a deal owner, pipeline access, an hour a week."*
> *"Deliberately anonymous — no client names, no invented numbers."*
> *"We are owners, not a fund. No fund clock, no forced exit, no fixed horizon."*

Where a caption does describe the artefact, write it in clipped technical
register:

> *"Schematic, plate two. Nodes and edges shown at arbitrary depth. Diagram is
> illustrative and not to scale."*

This is also where the honesty constraint (§1.1) gets discharged in words.

**Ticket-stub table**, bordered, at the base. Label above value, mono, cells
divided by 1px rules:

```
┌──────────────────┬─────────────────┬──────────────────┐
│ OPERATING WORK   │ ACQUISITIONS    │ CONTACT          │
│ LIVE TODAY       │ IN SEARCH       │ HELLO@…          │
└──────────────────┴─────────────────┴──────────────────┘
```

Use it on the opening and closing plates. Using it on all of them is monotonous.

---

## 5. Every plate is different

**The single most important compositional rule.** A poster series where every
plate looks alike is a template, not a series. Each plate needs its own visual
vocabulary while staying in one family.

The reference sequence, as an illustration of the *range* required:

| # | Ground | Visual | Why it differs |
|---|---|---|---|
| 01 | paper | Dense heat field, live, pointer-reactive | The full field. Opens loud |
| 02 | cobalt | Filled-dot constellation, tightly clustered | First schematic state |
| 03 | paper | Registration bar + two-column note | Furniture, not image. The reading plate |
| 04 | ink | Outlined squares, **arced** edges, sparse | Inverted ground, different marker, curved not straight |
| 05 | paper | **Nothing at all** | Unique by absence |
| 06 | cobalt | Heat field **starved** to survivors | Closes the loop back to 01 |

Note what varies: ground, marker shape, edge curvature, density, and *presence*.
Two plates using the same generator differ in at least three of those.

**Plate 05 having no visual is a deliberate design act, not an omission.** It
carries the most candid copy, and giving it nothing but type is what makes it
read as sincerity rather than salesmanship. Every series needs one plate that
stops performing.

**Plate 06 re-using plate 01's generator at a high threshold is the thesis made
visible.** The closing image is literally what survived the opening one.

---

## 6. The heat field

The system's signature. A continuous scalar field on a fixed lattice, quantised
into hard bands.

### 6.1 Parameters

```js
CELL    = 9      // px, fixed in SCREEN space, never scaled to viewport
BRUSH   = 10     // pointer heat radius, in cells
RELAX   = 0.055  // how fast the field chases its target
DIFFUSE = 0.045  // neighbour bleed
COOL    = 0.94   // pointer heat decay per frame
FREQ    = 0.052  // noise frequency; higher = finer structure
GRAIN   = 0.17   // static per-cell dither
```

### 6.2 Band table

```js
BANDS = [[0.30, ink], [0.46, cobalt], [0.62, sky], [0.78, signal]]
```

Below the first cut, the cell is **unpainted** and the ground shows through.
That transparency is what lets one field sit on any plate colour.

### 6.3 The lowest band sets the weight of the whole page

**The most consequential single decision in the band table**, and the least
obvious.

Field values cluster low, so the *lowest* band always covers the most area.
Whatever colour sits in that slot becomes the visual weight of the composition —
regardless of what the other bands do.

Putting `--ink` in the lowest slot produced a black mass with orange cores on
top: the heaviest possible pairing, and it fought the type below it rather than
supporting it. Moving `--sky` to the lowest slot and dropping ink entirely made
the same field read as light and atmospheric, with no change to the simulation.

| Lowest band | Reads as |
|---|---|
| Near-black | Heavy, industrial, dominant. Competes with type |
| Saturated hue | Bold but hard to sit type over |
| **Light tint** | Airy. Ground shows through the dissolve. Type stays dominant |

Corollaries:

- **A two-band field is often better than four.** Sky plus cobalt on paper is
  calmer than any four-band arrangement and loses nothing structurally.
- **The hot accent does not need to appear in the hero at all.** If the duotone
  type is already carrying the accent, the field adding orange is one signal too
  many. Ration it to a later plate, or drop it.
- Order bands light→saturated as value rises, not dark→light.

### 6.4 The four rules that decide whether it looks right

These are the ones I got wrong first and had to fix. Each is a visible failure.

1. **Banding is the entire aesthetic.** A smooth-gradient version of this looks
   like nothing at all. Quantise hard, never interpolate between bands.

2. **Keep `DIFFUSE` low.** At 0.14 the bands fuse into smooth topographic
   contours and the whole thing reads as a weather map. At 0.045 it stays
   granular. This is the single most sensitive constant.

3. **Static per-cell grain is what creates the dissolve.** Without
   `+ (hash(x,y) - 0.5) * GRAIN` added to the value before banding, band edges
   are clean contour lines. With it, edges break into individually surviving
   cells — the speckled dissolve that defines the reference. Use a *stable*
   hash, not per-frame noise, or it shimmers.

4. **Fixed cell size in screen pixels.** Density stays constant and a larger
   viewport simply holds more cells. Scaling cells to viewport width destroys
   the print-object read instantly.

### 6.5 Shaping

```js
ramp(u, v) = max(0, 1 - (u * 0.42 + v * 0.62)) ** 1.35 * 1.9
```

Diagonal falloff, mass upper-left, dissolving down and right. The exponent keeps
the boundary from reading as a straight line. Tune the coefficients so the mass
clears whatever type sits below it.

### 6.6 Rendering

Build an `ImageData` at **grid resolution** (one pixel per cell), then upscale
with `image-rendering: pixelated`. Do not draw thousands of rects — a 156×140
ImageData scaled to full width is dramatically cheaper and pixel-exact.

### 6.7 The pointer is a heat source

Not decoration. It is the reason the field feels live rather than pre-rendered,
and it is the cheapest expensive-feeling interaction in the system. Radial
falloff, squared, `max()`-accumulated into a separate buffer that cools at 0.94
per frame.

Gate it on `(pointer: fine)`. On touch there is no cursor and the sim should
just run.

---

## 7. The schematic

3D points, perspective-projected, drawn flat.

### 7.1 Why not three.js

The reference is **line art, not a lit scene**. Real 3D geometry with materials
and lighting actively breaks the aesthetic. A perspective divide in canvas 2D
gives genuine depth and rotation in ~200 lines with no dependency:

```js
scale = FOV / (FOV + z)          // FOV = 900
x_screen = w/2 + x_rot * scale * fit
y_screen = h/2 + y_rot * scale * fit
```

Depth reads through **scale and alpha**, never shading.

Add R3F only when you need something canvas genuinely cannot do — a Z-stack
camera dolly with depth-of-field across many plates, or shader post-processing.

### 7.2 Placement

**Cluster, never scatter uniformly.** Uniform random reads as noise; clustered
points read as designed. 3–6 cluster centres, 3–5 satellites each, plus a few
strays for irregularity.

Edges: k-nearest neighbours (k = 2–3), deduped by sorted index pair.

Use a **seeded PRNG** so the constellation is identical across reloads. A
diagram that reshuffles on refresh reads as a screensaver.

### 7.3 Variation axes

To make two schematics look unrelated, change at least three:

| Axis | Values |
|---|---|
| Marker | filled circle · outlined square |
| Edges | straight · quadratic arc |
| Density | clusters 3–6, satellites 3–5, strays 3–5 |
| Neighbours | 2 (sparse chains) · 3 (webbed) |
| Ground | any of the three triples |

### 7.4 Draw-on

Reveal edges then nodes progressively, `expo.out` over ~1.2s, triggered by
`IntersectionObserver`. Then **hold still** apart from the slow ambient
rotation. Continuously animating diagrams read as busy.

### 7.5 Canvas colour trap

**`ctx.fillStyle = 'var(--sky)'` silently fails and paints black.** Canvas 2D
does not resolve CSS custom properties, and there is no console warning.

```js
function resolve(color, el) {
  const m = color.match(/^var\((--[\w-]+)\)$/);
  return m ? getComputedStyle(el).getPropertyValue(m[1]).trim() : color;
}
```

Resolve once per mount, not per frame.

---

## 8. Motion

### 8.1 Stack

```
Lenis · GSAP ScrollTrigger · canvas 2D
```

- **Lenis over ScrollSmoother** — it wraps native scroll rather than replacing
  it, so `position: sticky`, keyboard paging, and accessibility survive.
- **GSAP is free**, all plugins included, since Webflow's April 2025 change.
- **Never run two scroll systems.**

```js
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

Disable Lenis entirely on `(pointer: coarse)` and under reduced-motion. Native
touch scrolling beats anything you simulate.

### 8.2 Easing and timing

| Use | Ease | Duration |
|---|---|---|
| Display type, plates entering | `expo.out` | 1.1–1.6s |
| Captions, rules, metadata | `power2.out` | 0.4–0.6s |
| Anything scroll-bound | `none` | `scrub: 1` |

**`scrub: 1`, never `scrub: true`.** The one-second catch-up is what produces
weight. `true` is rigid and reads mechanical.

**No overshoot or back easing, anywhere.** Springiness is the fastest way to
make a scientific-poster aesthetic look like a consumer app.

### 8.3 Reveal budget

24px of travel. 1.1s. That is all.

> **Motion applies to *some* layers, not all of them.**

Animate the type and let rules, captions, and grid hold still — or the reverse.
Uniform animation across every element is the definitive tell of a templated
site. Stagger siblings by hand at 60ms.

### 8.4 The scroll-driven threshold

The system's one genuinely distinctive scroll effect. As a plate leaves, its
field starves:

```js
ScrollTrigger.create({
  trigger: canvas,
  start: 'top top',
  end: 'bottom top',
  scrub: 1,
  onUpdate: (self) => { scrollRef.current = self.progress * 0.55; },
});
```

Write to a **ref**, never React state. Re-rendering a canvas host at 60fps is
pure waste.

Measured effect: painted coverage falls from ~60% to ~20% across one plate.

### 8.5 Reduced motion

```js
gsap.matchMedia().add({
  motion:  '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
}, (ctx) => { /* ScrollTriggers here auto-revert */ });
```

**Reduced motion means "no vestibular motion", not "no visual".** Keep opacity
reveals, drop travel to 0, shorten to 0.3s, freeze field churn, skip the
draw-on. The page should still feel composed, just still.

### 8.6 What makes it feel expensive

Response latency, not animation quantity.

- Never scroll-jack. It is the clearest INP killer.
- Snap micro-velocity to exact zero, or elements jitter imperceptibly forever
  and the page never feels *at rest*.
- `IntersectionObserver`-gate every canvas. Off-screen plates should cost zero.
- Cap DPR at 2.
- Restraint below the hero. **One showpiece, then discipline.** For anything
  asking real trust — acquisition, enterprise, finance — spectacle reads as a
  pitch and restraint reads as seriousness.

---

## 9. Layout traps

Each of these cost real debugging time.

**`<canvas>` carries an intrinsic aspect ratio** from its `width`/`height`
attributes. With `width: 100%; height: 100%` in an auto-height grid row, it
sizes *itself* from that ratio — a 156×140 canvas at 1393px wide claimed 1250px
of height and blew the sheet to 1993px against a 900px viewport.

> Always `position: absolute; inset: 0` a canvas inside a `position: relative`
> parent. Never let it participate in intrinsic sizing.

**Grid metadata needs an explicit column.** `grid-column: 3`, or a plate with
fewer captions silently mis-places it.

**Scope emphasis rules to the container, not the heading class.** `.headline em`
misses `.quiet em`. Use `.words em`.

**Flex-wrap will not rescue a table whose cells each exceed the track.** Below
560px, switch the stub table to `flex-direction: column` and move the divider
rule from `border-right` to `border-bottom`.

**Never key a React list by a content string that may repeat.** Four stub cells
labelled "You keep" produced duplicate-key errors. Key by index, and treat the
repetition itself as the real signal — four identical labels was also bad
design. Distinct labels fixed both problems at once.

**`align-items: end` on a mixed-height form row misaligns everything.** Use
explicit grid placement and `align-items: start`.

**Uppercase mono is for labels, never sentences.** A full sentence set in
tracked mono caps is shouty and slow to read. Label in mono, value in serif or
sans — the mixture is the point.

---

## 10. Responsive

| Breakpoint | Change |
|---|---|
| `< 760px` | Captions and metadata stack to one column; metadata ranges left; body columns collapse to one |
| `< 560px` | Stub table stacks vertically, rules move to block edges |
| `(pointer: coarse)` | No Lenis, no pointer heat. Sims still run — they are cheap |
| `(prefers-reduced-motion)` | Per §8.5 |

Cell size stays 9px at every breakpoint. Do not scale it.

---

## 11. Copy register

The visual system implies a voice, and mismatching them is the fastest way to
look like pastiche.

**Display type**: short declaratives. Plain verbs. Two beats, where the second
does the differentiating — that structure is what the duotone exists to serve.

> *"We buy companies. And we build alongside the people who run them."*

**Caption blocks**: clipped technical register, describing the plate as an
artefact. Present tense, no adjectives, no salesmanship.

> *"Field study, plate one. Density plot sampled continuously. Banding is
> quantised; intermediate values are not rendered."*

**Metadata**: nouns and facts only. Location, date, plate number, status.

**Never write evocative filler.** *"By the shore, time wears a different
shape"* — the line from the AI-generated source poster — is grammatically clean,
tonally literary, and means nothing. It is the single clearest tell of generated
design. If a caption does not describe the thing it labels, cut it.


### 11.1 Word budgets

The aesthetic collapses under wordiness. Long paragraphs on a plate make it read
as a slide deck, and the eye stops treating the sheet as a composed object.

| Element | Budget |
|---|---|
| Display line | 3–8 words |
| Lede / second voice | one sentence, ≤12 words |
| Caption block | ≤16 words |
| Index or table row body | one sentence, ≤14 words |
| Outcome / value line | ≤8 words |
| Prose block | 2 sentences, never 3 |

If something needs more words than the budget, it is the wrong structure — not
copy that needs a bigger box. Turn it into a table, an index, or a schedule,
where the structure carries meaning the prose was carrying.

**Prefer structure over sentences.** "Five ways we work with a company," set as
five ruled rows with a name, one line, and an outcome, is faster to read and
looks better than the same content as paragraphs.

### 11.2 One claim, one plate

**Every claim lives on exactly one plate.** Repetition is the second thing that
makes these sites feel overwhelming, and it is harder to see than wordiness
because each instance looks reasonable on its own.

Audit before shipping. Grep the content file for the distinctive phrases and
count them. A real audit from one build:

```
"we buy companies"     hero · service list · own plate · nav · footer   5x
"a home, not an exit"  service list · audience card · own plate         3x
"keep the team"        audience card · ownership plate                  2x
operating-status line  hero paragraph · hero stub table                 2x  (same plate!)
```

The fix is subtractive and mechanical:

- Give each subject **one owning plate**, and cut every other mention. If buying
  has its own plate, the service index does not also list it.
- Never state the same fact twice on a single plate. A stub table and a stage
  line saying the same thing is one of them too many — keep whichever has the
  better voice.
- The hero should **not summarise the site.** Headline, second voice, and one
  candour line. A hero paragraph enumerating the services duplicates the plate
  that exists to enumerate them.
- Navigation and footer links repeating section names is fine — that is
  wayfinding, not content.

Deleting duplicates is also the cheapest way to shorten a page: one editing pass
removed ~15% of total page height with nothing of substance lost.

### 11.3 Captions must describe their diagram

Check that captions actually match their diagrams. The source poster captioned a
node-and-edge network as a *"eukaryotic model organism with membrane-bound
organelles."* Text that does not describe its image is the giveaway.

---

## 12. Adapting to a new project

In order:

1. **Find the density→sparsity meaning.** Selection, distillation, signal from
   noise, survivorship. If none fits the brand's argument, this system is the
   wrong system — do not force it.
2. **Pick the saturated field colour.** One hue. Everything else follows.
3. **Derive the five tokens.** Warm ground (never `#fff`), near-black, the
   field hue, a light tint of it, one rationed hot accent.
4. **Rebuild the band table** from the new palette, cool → hot, 3–4 bands.
5. **Set the plate count.** Five to seven. Fewer reads thin, more reads padded.
6. **Assign a distinct visual per plate** using §5 and §7.3. Include one plate
   with no visual.
7. **Write captions in the artefact register** (§11) before designing them.
8. **Discharge the honesty constraint** (§1.1) explicitly.

### What must not change

- Five colours
- Three faces, three jobs
- Hard banding, low diffusion, static grain, fixed cell size
- `scrub: 1`, `expo.out`, 24px reveals
- Type inset, image full-bleed
- Every plate different
- Content plates size to content
- A masthead carrying the wordmark, and a real footer
- A light tint in the lowest band
- One claim, one plate

### What should change every time

- The hue
- The metaphor
- Plate count and sequence
- Which plate is the silent one
- Marker shapes and edge curvature

---

## 13. File map

```
app/
  layout.tsx            fonts, metadata
  globals.css           tokens, reset, .meta .caption .display
  page.tsx              the plate sequence — the only content file
  page.module.css       per-plate composition
components/
  Masthead.tsx/.module.css  sticky wordmark + nav
  Poster.tsx/.module.css    the sheet frame
  HeatField.tsx             the posterised field   (§6)
  NodeField.tsx             the 3D schematic       (§7)
  Registration.tsx          ruled measurement bar  (furniture)
  Timeline.tsx/.module.css  proportional schedule  (furniture)
  Reveal.tsx                entry reveal + parallax
  SmoothScroll.tsx          Lenis + ScrollTrigger wiring
  Footer.tsx/.module.css    the closing footer
```

`page.tsx` is data. Everything else is system. Adding a plate should mean adding
one `<Poster>` block and nothing else.

---

## 14. The short version

1. One field, two threshold states. Dense resolves to sparse, and it means
   something.
2. Five colours. `--signal` is rationed to ~2% of pixels.
3. Serif displays, mono documents, sans reads. Never blur the roles.
4. Emphasis changes colour, not opacity.
5. Plates are objects: margin, shadow, image bleeds, type insets.
6. Every plate different. One plate silent.
7. Hard bands, low diffusion, static grain, 9px cells. Get these four wrong and
   nothing else matters.
8. Cluster points, seed the RNG, draw flat, resolve `var()` before canvas.
9. `scrub: 1`. `expo.out`. 24px. Animate some layers, not all.
10. Reduced motion keeps the visual, drops the travel.
11. Captions describe what they label, or they get cut.
12. One showpiece, then discipline.
13. Fill plates with material, never ornament — and let content plates size to
    their content.
14. The wordmark is the first thing read. Never leave it in the metadata block.
15. The lowest band sets the page's weight. Put a light tint there, not black.
16. One claim, one plate. Audit for repeats before shipping.
17. Word budgets are real. If copy exceeds one, change the structure — not the
    box.
18. Captions are optional. Delete rather than fill — never restate the metadata,
    never disclaim a risk nobody has.
