# EIGENV

A one-page site built as a **poster series**: eight full-bleed "plates" on a
grey surround, with a sticky masthead and a footer.

**Read [`DESIGN.md`](./DESIGN.md) before changing anything visual.** It is the
system of record — palette, type scale, plate anatomy, the heat-field
parameters, motion rules, and the failure modes that are invisible until they
look wrong.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static prerender
```

## Structure

```
content.ts               shared copy (services, audiences, contact)
app/
  layout.tsx             fonts, metadata, JSON-LD
  globals.css            the five palette tokens, type primitives, skip link
  page.tsx               the plate sequence — the only content file
  page.module.css        per-plate composition
components/
  Masthead.tsx           sticky wordmark + section nav
  Poster.tsx             the sheet frame every plate uses
  HeatField.tsx          posterised heat field, canvas 2D   (DESIGN.md §6)
  NodeField.tsx          3D node schematic, canvas 2D       (DESIGN.md §7)
  Registration.tsx       ruled measurement bar
  Timeline.tsx           proportional engagement schedule
  ContactForm.tsx        enquiry form
  Reveal.tsx             scroll entry reveals
  SmoothScroll.tsx       Lenis + ScrollTrigger wiring
  Footer.tsx             closing footer
```

`page.tsx` is data; everything else is system. Adding a plate should mean adding
one `<Poster>` block and nothing else.

## Things worth knowing

- **The palette is five colours.** Do not add a sixth. `--signal` is rationed to
  roughly 2% of painted cells.
- **The canvases are CPU, not WebGL** — deliberately. The reference is line art,
  not a lit scene. See DESIGN.md §7.1.
- **Canvas 2D does not resolve CSS custom properties.** `ctx.fillStyle =
  'var(--sky)'` silently paints black. Colours are resolved via
  `getComputedStyle` before they reach the context.
- **Both canvases stop when off-screen** via `IntersectionObserver`, and draw a
  single settled frame under `prefers-reduced-motion` rather than looping.
- **The contact form has no backend.** It composes a `mailto:` and opens the
  user's mail client. Swap `handleSubmit` in `ContactForm.tsx` for a server
  action when an endpoint exists; the markup does not need to change.

## Status

The operating work is live; no acquisitions have closed yet. Copy and metadata
are written to say so — if you edit the description or the footer tagline, keep
that true.
