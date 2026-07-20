'use client';

import { useSyncExternalStore } from 'react';
import { getConsent, setConsent } from '@/lib/consent';
import styles from './Consent.module.css';

function subscribe(onChange: () => void): () => void {
  window.addEventListener('eigenv-consent', onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener('eigenv-consent', onChange);
    window.removeEventListener('storage', onChange);
  };
}

/**
 * A lean, granular consent notice. The only cookie the site can set is the
 * analytics visitor id, and only if the visitor accepts here. "Necessary only"
 * opts out of analytics entirely.
 *
 * Consent is read via useSyncExternalStore, so the banner reflects a stored
 * choice without a setState-in-effect, and hides the instant one is made. The
 * server snapshot is a decided value, so the banner never renders in the SSR
 * HTML — it appears (with its rise) only for undecided visitors after hydration.
 */
export default function Consent() {
  const consent = useSyncExternalStore(subscribe, getConsent, () => 'necessary' as const);

  function choose(value: 'analytics' | 'necessary') {
    setConsent(value);
  }

  if (consent !== null) return null;

  return (
    <div className={styles.bar} role="region" aria-label="Cookie consent">
      <p className={styles.copy}>
        We keep this light. Nothing is stored on your device unless you allow
        analytics, which sets one first-party cookie so we can recognise
        returning visits. No tracking cookies, no cross-site profiling. See our{' '}
        <a href="/privacy">Privacy</a> and <a href="/terms">Terms</a>.
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.btn} ${styles.secondary}`}
          onClick={() => choose('necessary')}
        >
          Necessary only
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.primary}`}
          onClick={() => choose('analytics')}
        >
          Accept analytics
        </button>
      </div>
    </div>
  );
}
