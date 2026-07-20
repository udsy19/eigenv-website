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

## Deploy (Vercel)

The project is a stock Next.js app; import the repo at vercel.com and it builds
with no configuration. Two Vercel features are already wired in `app/layout.tsx`
and activate automatically on deploy:

- **Web Analytics** (traffic) — enable under the project's Analytics tab.
- **Speed Insights** (field Core Web Vitals) — enable under Speed Insights.

Set the domain in three places if it is not `eigenv.ai`: `metadataBase` and the
JSON-LD in `app/layout.tsx`, `app/robots.ts`, and `app/sitemap.ts`.

## Backend (Notion + Resend)

Form submissions POST to `app/api/enquiry`, which records the enquiry (and any
PDF) in Notion and sends the visitor a branded confirmation email via Resend.
Without these env vars the form falls back to composing a `mailto`, so nothing
is ever silently lost.

Set in Vercel (Project settings → Environment Variables):

| Var | What |
|---|---|
| `NOTION_TOKEN` | Notion internal integration secret |
| `NOTION_DATABASE_ID` | the target database, shared with the integration |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM` | a sender on a Resend-verified domain, e.g. `EIGENV <ada@eigenv.ai>` |
| `ALERT_TO` | optional — internal copy of each enquiry |

**Notion database** needs these properties: `Name` (title), `Email` (email),
`Role` (text), `Company` (text), `Timing` (text), `Looking to` (multi-select),
`Link` (url), `Attachment` (files). Share the database with the integration.

**Resend** only delivers to arbitrary recipients from a **verified domain** — in
test mode (`onboarding@resend.dev`) it reaches only your own account address. So
verify `eigenv.ai` in Resend and set `RESEND_FROM` to a sender on it before the
confirmation email will reach visitors.

**Company-email gate**: the form rejects free/personal mailbox providers
(Gmail, Outlook, iCloud, …) both client-side and in the API route. The list is
`lib/company-email.ts`.

## Visit analytics (cookieless)

A beacon (`components/Track.tsx`) fires once per page load to `app/api/track`,
which records the visit in a Notion "Visitors" database. It is **cookieless**:
no persistent identifier, no fingerprint, no cross-site or credit enrichment,
and the raw IP is never stored. Disclosed in the footer.

Captured per visit: path, referrer, campaign (UTM), coarse geo (country /
region / city, from Vercel edge headers), device, browser, OS, language, screen
size, timezone — and, if `IPINFO_TOKEN` is set, the visitor's **company**
(org-level, for B2B).

Setup: set `NOTION_VISITORS_DATABASE_ID` (the database was created by the same
integration). Geo is blank in local dev and populates on Vercel. Note Notion's
API is rate-limited (~3 req/s) — fine for a low-traffic site; for real volume,
write visits to Postgres and sync to Notion, or use a purpose-built analytics
tool. It is best-effort and never blocks or affects the page.
