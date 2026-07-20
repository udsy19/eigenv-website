'use client';

import { useEffect } from 'react';

/**
 * Sends one cookieless analytics beacon per page load. Collects only what the
 * browser already exposes to any page — no persistent id, no fingerprint. The
 * server adds coarse geo from edge headers. Fire-and-forget; failures are
 * silent and never affect the page.
 */
export default function Track() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm = ['utm_source', 'utm_medium', 'utm_campaign']
      .map((key) => params.get(key))
      .filter(Boolean)
      .join(' · ');

    const body = JSON.stringify({
      path: window.location.pathname,
      referrer: document.referrer || '',
      campaign: utm,
      screen: `${window.screen.width}×${window.screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    // sendBeacon survives the page unloading; fetch is the fallback
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
    } else {
      fetch('/api/track', { method: 'POST', body, keepalive: true }).catch(() => {});
    }
  }, []);

  return null;
}
