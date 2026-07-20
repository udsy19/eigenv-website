'use client';

import type Lenis from 'lenis';
import styles from './EngageHero.module.css';

/**
 * The hero's job is to get the visitor to the enquiry form. It states what we
 * do and gives one action — no field to fill here, so the ask stays weightless.
 * The form itself lives on the closing plate.
 */
export default function EngageHero({ headingId }: { headingId: string }) {
  function goToForm(event: React.MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById('contact');
    if (!target) return; // let the href fall through as a normal anchor jump
    event.preventDefault();
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(target, { offset: -72 });
    else target.scrollIntoView({ behavior: 'smooth' });
    history.pushState(null, '', '#contact');
  }

  return (
    <>
      <h1 id={headingId} className={`display ${styles.heading}`}>
        Consulting every founder could use.
      </h1>
      <a href="#contact" className={styles.cta} onClick={goToForm}>
        Talk to us →
      </a>
    </>
  );
}
