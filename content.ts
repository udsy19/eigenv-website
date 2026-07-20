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
    body: 'Every early company sells the same way: the founder, an inbox, and instinct. It works — right up until the next stage needs a system, not a hero. We build the machine while deals are live: pipeline stages, qualification, a CRM your leadership actually trusts, playbooks your team actually follows. Seed to Series B. Twelve weeks.',
    keep: 'A sales motion that runs without the founder in every deal — and without us in any of them.',
  },
  {
    id: 'leadership',
    index: '02',
    name: 'Leadership when you need it',
    body: 'Seats go empty at the worst possible moments, and hiring under pressure is how expensive mistakes get made. An experienced operator takes the seat within days — runs the team, keeps the cadence, steadies the room — so you can search for the permanent answer without a clock ticking behind you.',
    keep: 'Continuity now, a calm hire later, and a stronger bench when we hand back the keys.',
  },
  {
    id: 'product-forward',
    index: '03',
    name: 'Moving product forward',
    body: "Every roadmap has one: the initiative everyone agrees matters and nobody has time to own. It doesn't fail, exactly — it just never finishes. We give stalled work the three things it's missing: real scope, an owner with authority, and a weekly cadence that makes drift visible while it's still cheap to fix.",
    keep: 'A path to done, a date attached to it, and someone accountable the entire way.',
  },
  {
    id: 'product-growth',
    index: '04',
    name: 'Product, studied and grown',
    body: "Most growth playbooks are borrowed from companies whose users behave nothing like yours. So we start by watching yours — where they arrive, where they stall, where they quietly leave — and build the growth loops on that evidence rather than on someone else's blog post.",
    keep: 'Growth systems built on how your users actually behave, documented so your team can run and tune them without us.',
  },
  {
    id: 'rfp-review',
    index: '05',
    name: 'RFP and RFQ review',
    body: "Most RFPs are decided in the writing, not the reading. Vague requirements attract the wrong vendors; rushed answers read like everyone else's. We're the second read from someone who has sat on both sides of the table — sharper asks before you issue, a stronger case before you submit.",
    keep: 'A cleaner path to yes, and the judgment to skip the ones you were never going to win.',
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

export const LOOKING_TO = [
  { value: 'sell', label: 'Sell a company' },
  { value: 'consulting', label: 'Consulting' },
];

export const CONTACT_EMAIL = 'ada@eigenv.ai';
export const LOCATION = 'San Francisco, California';
