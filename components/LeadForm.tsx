'use client';

import { useState } from 'react';
import { CONTACT_EMAIL, LOOKING_TO } from '@/content';
import styles from './LeadForm.module.css';

/**
 * The enquiry form, used both in the hero (after the email is captured) and on
 * the closing plate. One definition, two entry points.
 *
 * No backend yet — it composes the enquiry into a mail client, which actually
 * delivers it. Swap `handleSubmit` for a server action when an endpoint exists;
 * the markup does not change.
 */

type Props = {
  /** pre-captured in the hero; when present the email field is not shown */
  email?: string;
};

export default function LeadForm({ email }: Props) {
  const [status, setStatus] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? '').trim();
    const looking = LOOKING_TO.filter((o) => data.get(o.value)).map((o) => o.label);

    const from = email ?? get('email');
    const body = [
      `Name: ${get('name')}`,
      `Email: ${from}`,
      `Role: ${get('role') || '—'}`,
      `Company: ${get('company') || '—'}`,
      `Timing: ${get('timing') || 'ASAP'}`,
      `Looking to: ${looking.length ? looking.join(', ') : '—'}`,
    ].join('\n');

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `Enquiry from ${get('name')}`
    )}&body=${encodeURIComponent(body)}`;
    setStatus(`Opening your mail client. If nothing happens, write to ${CONTACT_EMAIL}.`);
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        {!email && (
          <label className={styles.field}>
            <span className="meta">Email</span>
            <input type="email" name="email" autoComplete="email" required />
          </label>
        )}
        <label className={styles.field}>
          <span className="meta">Name</span>
          <input type="text" name="name" autoComplete="name" required />
        </label>
        <label className={styles.field}>
          <span className="meta">Role</span>
          <input
            type="text"
            name="role"
            autoComplete="organization-title"
            placeholder="Founder, operator, investor…"
          />
        </label>
        <label className={styles.field}>
          <span className="meta">Company</span>
          <input type="text" name="company" autoComplete="organization" />
        </label>
        <label className={styles.field}>
          <span className="meta">Timing</span>
          <input type="text" name="timing" defaultValue="ASAP" />
        </label>

        <fieldset className={`${styles.field} ${styles.choices}`}>
          <legend className="meta">Looking to</legend>
          {LOOKING_TO.map((option) => (
            <label key={option.value} className={styles.check}>
              <input type="checkbox" name={option.value} />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>

        <button type="submit" className={styles.submit}>
          Send →
        </button>
      </form>

      <p role="status" aria-live="polite" className={`meta ${styles.status}`}>
        {status}
      </p>
    </>
  );
}
