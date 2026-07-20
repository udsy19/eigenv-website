'use client';

import { useEffect } from 'react';
import { getConsent, getVid } from '@/lib/consent';

/**
 * One cookieless analytics beacon per page load. Collects only what the browser
 * exposes to any page. The server adds coarse geo from edge headers.
 *
 * Consent-aware: an explicit "necessary only" suppresses it entirely; "accept
 * analytics" attaches the first-party visitor id so returning visits link up;
 * undecided sends an anonymous, id-less beacon. Fire-and-forget.
 */
export default function Track() {
  useEffect(() => {
    const consent = getConsent();
    if (consent === 'necessary') return; // opted out

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
      visitorId: consent === 'analytics' ? getVid() : undefined,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
    } else {
      fetch('/api/track', { method: 'POST', body, keepalive: true }).catch(() => {});
    }
  }, []);

  return null;
}
