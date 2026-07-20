import type { CSSProperties } from 'react';
import Draw from './Draw';
import styles from './Timeline.module.css';

/**
 * Engagement schedule, drawn as a proportional bar.
 *
 * Plate four is a specification, so its visual is a schedule — the same
 * document family as the registration bar, and it carries real information
 * rather than decorating the sheet.
 */

const PHASES = [
  { weeks: 'Weeks 1–2', name: 'Diagnose', span: 2 },
  { weeks: 'Weeks 3–8', name: 'Build', span: 6 },
  { weeks: 'Weeks 9–12', name: 'Run and hand over', span: 4 },
];

const TOTAL = PHASES.reduce((sum, p) => sum + p.span, 0);

export default function Timeline() {
  return (
    <Draw className={styles.timeline} bars={`.${styles.bar}`}>
      <div
        className={styles.track}
        style={{ '--track': PHASES.map((p) => `${p.span}fr`).join(' ') } as CSSProperties}
      >
        {PHASES.map((phase) => (
          <div key={phase.name} className={styles.phase}>
            <span className={`meta ${styles.weeks}`}>{phase.weeks}</span>
            <span className={styles.name}>{phase.name}</span>
            <span className={styles.bar} aria-hidden="true" />
          </div>
        ))}
      </div>
      <p className={`meta ${styles.total}`}>
        {TOTAL} weeks, with your leadership and team throughout
      </p>
    </Draw>
  );
}
