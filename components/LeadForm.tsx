'use client';

import { useState } from 'react';
import { CONTACT_EMAIL, LOOKING_TO } from '@/content';
import { COMPANY_EMAIL_MESSAGE, isCompanyEmail } from '@/lib/company-email';
import styles from './LeadForm.module.css';

/**
 * The enquiry form. Posts to /api/enquiry, which records the enquiry (and any
 * PDF) in Notion and sends a branded confirmation email via Resend.
 *
 * If the backend is not configured it replies { fallback: true } and the form
 * composes a mailto instead, so an enquiry is never silently lost.
 */

const MAX_PDF_BYTES = 10 * 1024 * 1024;

type State = 'idle' | 'sending' | 'done' | 'error';

export default function LeadForm() {
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const data = new FormData(formEl);
    const email = String(data.get('email') ?? '').trim();

    if (!isCompanyEmail(email)) {
      setEmailError(COMPANY_EMAIL_MESSAGE);
      formEl.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
      return;
    }
    setEmailError('');

    const attachment = data.get('attachment');
    if (attachment instanceof File && attachment.size > 0) {
      if (attachment.type !== 'application/pdf') {
        fail('That attachment is not a PDF. Please attach a PDF, or share a link.');
        return;
      }
      if (attachment.size > MAX_PDF_BYTES) {
        fail('That PDF is over 10 MB. Please share a link to it instead.');
        return;
      }
    }

    setState('sending');
    try {
      const res = await fetch('/api/enquiry', { method: 'POST', body: data });
      const result = await res.json().catch(() => ({}));

      if (res.ok && result.ok) {
        setState('done');
        setMessage('Thank you. We have it, and a confirmation is on its way to your inbox.');
        formEl.reset();
        return;
      }
      if (result.fallback) {
        composeMail(data);
        return;
      }
      fail(result.error ?? 'Something went wrong. Please email us directly.');
    } catch {
      composeMail(data, 'We could not submit that automatically. Opening your mail client instead.');
    }
  }

  function fail(text: string) {
    setState('error');
    setMessage(text);
  }

  function composeMail(data: FormData, note?: string) {
    const get = (key: string) => String(data.get(key) ?? '').trim();
    const looking = LOOKING_TO.filter((o) => data.get(o.value)).map((o) => o.label);
    const body = [
      `Name: ${get('name')}`,
      `Email: ${get('email')}`,
      `Role: ${get('role') || 'n/a'}`,
      `Company: ${get('company') || 'n/a'}`,
      `Timing: ${get('timing') || 'ASAP'}`,
      `Looking to: ${looking.join(', ') || 'n/a'}`,
      `Link: ${get('link') || 'n/a'}`,
    ].join('\n');
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `Enquiry from ${get('name')}`
    )}&body=${encodeURIComponent(body)}`;
    setState('done');
    setMessage(note ?? `Opening your mail client. If nothing happens, write to ${CONTACT_EMAIL}.`);
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.field}>
          <span className="meta">Name</span>
          <input type="text" name="name" autoComplete="name" required />
        </label>
        <label className={styles.field}>
          <span className="meta">Company email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? 'email-error' : undefined}
            onInput={() => emailError && setEmailError('')}
            required
          />
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

        {/* Give us the data up front: a PDF, or a link to it. */}
        <label className={`${styles.field} ${styles.fieldWide}`}>
          <span className="meta">Share a link</span>
          <input
            type="url"
            name="link"
            inputMode="url"
            placeholder="https://…  (deck, data room, site)"
          />
        </label>
        <label className={`${styles.field} ${styles.fieldWide}`}>
          <span className="meta">Or attach a PDF</span>
          <input type="file" name="attachment" accept="application/pdf" />
        </label>

        {emailError && (
          <p id="email-error" className={`meta ${styles.error}`}>
            {emailError}
          </p>
        )}

        <button type="submit" className={styles.submit} disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send →'}
        </button>
      </form>

      <p role="status" aria-live="polite" className={`meta ${styles.status}`}>
        {message}
      </p>
    </>
  );
}
