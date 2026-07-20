'use client';

import { useState } from 'react';
import type Lenis from 'lenis';
import LeadForm from './LeadForm';
import styles from './EngageHero.module.css';

/**
 * The hero is the primary point of contact. It captures an email first — the
 * lowest-friction thing to ask for — then, once given, scrolls to the top and
 * opens the rest of the form. Everything the visitor needs to reach us is the
 * first thing they see.
 */
export default function EngageHero({ headingId }: { headingId: string }) {
  const [email, setEmail] = useState('');
  const [entered, setEntered] = useState(false);

  function submitEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;
    setEntered(true);

    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 0.8 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Poster already wraps children in its .words grid area, so this returns a
  // fragment rather than nesting another block.
  if (entered) {
    return (
      <>
        <p className={`meta ${styles.confirm}`}>
          <span aria-hidden="true">✓ </span>Email entered — {email}
        </p>
        <h1 id={headingId} className={`display ${styles.heading}`}>
          Tell us a little more.
        </h1>
        <LeadForm email={email} />
      </>
    );
  }

  return (
    <>
      <h1 id={headingId} className={`display ${styles.heading}`}>
        Consulting every founder could use.
      </h1>
      <form className={styles.capture} onSubmit={submitEmail}>
        <label className={styles.captureField}>
          <span className="meta">Have something you want to share?</span>
          <span className={styles.inputRow}>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" aria-label="Continue">
              →
            </button>
          </span>
        </label>
      </form>
    </>
  );
}
