'use client';

/**
 * Consent + the analytics visitor id, kept lean.
 *
 * `necessary`  — the visitor opted out of analytics; send nothing.
 * `analytics`  — opted in; a first-party visitor id (cookie) is set so returning
 *                visits can be recognised.
 * `null`       — not decided yet; the cookieless anonymous beacon still runs
 *                under legitimate interest (no cookie, no id), which is disclosed.
 *
 * The only cookie this site ever sets is the analytics visitor id, and only
 * after explicit opt-in.
 */

export type Consent = 'analytics' | 'necessary';

const CONSENT_KEY = 'eigenv-consent';
const VID_COOKIE = 'eigenv_vid';

export function getConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === 'analytics' || value === 'necessary' ? value : null;
}

export function setConsent(value: Consent): void {
  window.localStorage.setItem(CONSENT_KEY, value);
  if (value === 'analytics') ensureVid();
  else clearVid();
  window.dispatchEvent(new CustomEvent('eigenv-consent', { detail: value }));
}

export function getVid(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)eigenv_vid=([^;]+)/);
  return match ? match[1] : null;
}

function ensureVid(): string {
  const existing = getVid();
  if (existing) return existing;
  const id = crypto.randomUUID();
  // first-party, 1 year, SameSite=Lax; Secure in production (https)
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${VID_COOKIE}=${id}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax${secure}`;
  return id;
}

function clearVid(): void {
  document.cookie = `${VID_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}
