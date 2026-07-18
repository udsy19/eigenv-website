/**
 * Single source of truth for content that appears in more than one place.
 *
 * The footer previously restated the service list by hand, and three of the
 * five names had drifted out of sync with the page ("Move a product forward"
 * vs "Moving product forward", and a "Hook & Grow" entry naming nothing that
 * existed anywhere on the site).
 */

export type Service = {
  id: string;
  index: string;
  name: string;
  body: string;
  keep: string;
};

export const SERVICES: Service[] = [
  {
    id: 'go-to-market',
    index: '01',
    name: 'Go-to-market',
    body: 'The full enterprise sales build. Seed to Series B, usually three months.',
    keep: 'A motion your team runs without us.',
  },
  {
    id: 'leadership',
    index: '02',
    name: 'Leadership when you need it',
    body: 'An experienced operator takes the seat and steadies it.',
    keep: 'Continuity now, a stronger bench after.',
  },
  {
    id: 'product-forward',
    index: '03',
    name: 'Moving product forward',
    body: 'A stalled or under-resourced initiative gets scope, owners, and cadence.',
    keep: 'A path to done, and someone accountable.',
  },
  {
    id: 'product-growth',
    index: '04',
    name: 'Product, studied and grown',
    body: 'Behaviour studies first. Then growth loops built on how people actually use it.',
    keep: 'Growth systems your team can run.',
  },
  {
    id: 'rfp-review',
    index: '05',
    name: 'RFP and RFQ review',
    body: 'A second read — before you issue one, or before you answer one.',
    keep: 'A cleaner path to yes.',
  },
];

export type Audience = { id: string; who: string; body: string };

export const AUDIENCES: Audience[] = [
  {
    id: 'founders',
    who: 'Founders',
    body: 'Closest to the product, shortest on senior hands. We build what is hard to build, and keep your options open.',
  },
  {
    id: 'private-equity',
    who: 'Private equity',
    body: 'A value-creation plan and a clock. Operators who arrive quickly and work at portfolio-company level.',
  },
  {
    id: 'venture-capital',
    who: 'Venture capital',
    body: 'We have done the first sales-leader job before the first sales leader exists — and handed it over when they arrive.',
  },
  {
    id: 'owners',
    who: 'Owners',
    body: 'Weighing what comes next. Call us when you want a direct conversation, not a process.',
  },
];

export const CONTACT_EMAIL = 'hello@eigenv.ai';
export const LOCATION = 'San Francisco, California';
