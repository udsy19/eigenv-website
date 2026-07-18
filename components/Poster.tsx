import type { ReactNode } from 'react';
import Reveal from './Reveal';
import styles from './Poster.module.css';

export type Stub = { label: string; value: string };

const TONES = {
  paper: styles.tonePaper,
  cobalt: styles.toneCobalt,
  ink: styles.toneInk,
};

type Props = {
  /** Chooses ground, figure, accent, muted and rule as a contrast-checked set.
   *  See Poster.module.css — assembling them by hand let sky-on-cobalt (3.81:1)
   *  end up carrying 11px labels. */
  tone: keyof typeof TONES;
  /** Short caption columns, top of composition. Optional, and it should stay
   *  that way: a caption that restates the metadata block or disclaims a risk
   *  nobody has is noise. Omit rather than fill. */
  captions?: string[];
  /** uppercase mono metadata, top right */
  meta: ReactNode;
  /** field or diagram occupying the middle band */
  visual?: ReactNode;
  /** false when the middle band holds type rather than a full-bleed visual */
  bleed?: boolean;
  /** huge lowercase serif, bottom of composition */
  children: ReactNode;
  /** bordered ticket-stub table at the base */
  stubs?: Stub[];
  /** 'half' relaxes the full-viewport minimum — for short plates like contact */
  size?: 'full' | 'half';
  /** anchor target for masthead and footer navigation */
  id?: string;
  /** id of this plate's heading, so the section becomes a named landmark */
  labelledBy: string;
};

export default function Poster({
  tone,
  captions = [],
  meta,
  visual,
  bleed = true,
  children,
  stubs,
  size = 'full',
  id,
  labelledBy,
}: Props) {
  return (
    <section
      id={id}
      // without an accessible name a <section> is not exposed as a landmark,
      // so none of the plates were reachable by landmark navigation
      aria-labelledby={labelledBy}
      className={[
        styles.sheet,
        TONES[tone],
        size === 'half' && styles.half,
        !bleed && styles.content,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* captions and metadata lead, so the sheet reads as a document before
          the image arrives */}
      <header className={styles.head}>
        {captions.map((text, i) => (
          <Reveal as="p" key={text} className="caption" delay={i * 0.06} y={16}>
            {text}
          </Reveal>
        ))}
        <Reveal className={`${styles.headMeta} meta`} delay={0.12} y={16}>
          {meta}
        </Reveal>
      </header>

      {/* The heading block precedes the visual in the DOM so the outline reads
          h2 → h3, not h3 → h2. Visual order is restored by grid-row: a plate's
          visual sits above its headline, but its heading is announced first. */}
      <Reveal className={styles.words} delay={0.1}>
        {children}
      </Reveal>

      <div className={bleed ? styles.field : styles.slot}>{visual}</div>

      {stubs && (
        <Reveal className={`${styles.foot} meta`} delay={0.2} y={16}>
          {stubs.map((stub, i) => (
            <div key={i} className={styles.stub}>
              <span className={styles.stubLabel}>{stub.label}</span>
              <span>{stub.value}</span>
            </div>
          ))}
        </Reveal>
      )}
    </section>
  );
}
