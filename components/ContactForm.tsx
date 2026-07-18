'use client';

import { useState } from 'react';
import { CONTACT_EMAIL } from '@/content';
import styles from './ContactForm.module.css';

/**
 * There is no backend yet, and a form that silently GETs the current URL —
 * discarding the message and reloading the page — is worse than no form. This
 * composes the enquiry into a mail client, which actually delivers it.
 *
 * Swap `handleSubmit` for a server action when an endpoint exists; the markup
 * does not need to change.
 */

const ROLES = [
  { value: 'founder', label: 'Founder' },
  { value: 'private-equity', label: 'Private equity' },
  { value: 'venture-capital', label: 'Venture capital' },
  { value: 'owner', label: 'Owner' },
];

export default function ContactForm() {
  const [status, setStatus] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? '').trim();

    const body = [
      `Name: ${get('name')}`,
      `Company: ${get('company') || '—'}`,
      `Role: ${get('role')}`,
      `Timing: ${get('timing') || '—'}`,
      '',
      get('need'),
    ].join('\n');

    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `Enquiry from ${get('name')}`
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    setStatus(`Opening your mail client. If nothing happens, write to ${CONTACT_EMAIL}.`);
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className="meta">Name</span>
          <input type="text" name="name" autoComplete="name" required />
        </label>
        <label className={styles.field}>
          <span className="meta">Email</span>
          <input type="email" name="email" autoComplete="email" required />
        </label>
        <label className={styles.field}>
          <span className="meta">Role</span>
          {/* explicit values, so the payload does not break when copy changes */}
          <select name="role" defaultValue="" required>
            <option value="" disabled>
              Select
            </option>
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className="meta">Company</span>
          <input type="text" name="company" autoComplete="organization" />
        </label>
        <label className={styles.field}>
          <span className="meta">Timing</span>
          <input type="text" name="timing" placeholder="e.g. this quarter" />
        </label>
        <label className={`${styles.field} ${styles.fieldWide}`}>
          <span className="meta">What you need</span>
          <textarea name="need" rows={3} required />
        </label>
        <button type="submit" className={styles.submit}>
          Talk to us →
        </button>
      </form>

      <p role="status" aria-live="polite" className={`meta ${styles.status}`}>
        {status}
      </p>
    </>
  );
}
