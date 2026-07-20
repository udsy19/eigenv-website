/**
 * Enquiries are meant to come from people acting for a company, so free/personal
 * mailbox providers are rejected. Shared by the form (instant feedback) and the
 * API route (the real gate — client checks are advisory).
 */

const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.uk',
  'yahoo.co.in',
  'ymail.com',
  'rocketmail.com',
  'hotmail.com',
  'hotmail.co.uk',
  'outlook.com',
  'live.com',
  'msn.com',
  'aol.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'proton.me',
  'protonmail.com',
  'pm.me',
  'gmx.com',
  'gmx.net',
  'mail.com',
  'yandex.com',
  'yandex.ru',
  'zoho.com',
  'hey.com',
  'fastmail.com',
  'tutanota.com',
  'tuta.io',
  'hushmail.com',
  'inbox.com',
  'mailinator.com',
]);

const EMAIL_RE = /^[^@\s]+@([^@\s]+\.[^@\s]+)$/;

/** true only for a syntactically valid address on a non-free domain */
export function isCompanyEmail(email: string): boolean {
  const match = EMAIL_RE.exec(email.trim().toLowerCase());
  if (!match) return false;
  return !FREE_EMAIL_DOMAINS.has(match[1]);
}

export const COMPANY_EMAIL_MESSAGE =
  'Please use your company email — personal addresses (Gmail, Outlook, iCloud…) are not accepted.';
