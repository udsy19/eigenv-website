'use client';

import { useState } from 'react';
import { CONTACT_EMAIL, LOOKING_TO } from '@/content';
import { COMPANY_EMAIL_MESSAGE, isCompanyEmail } from '@/lib/company-email';
import styles from './LeadForm.module.css';

/**
 * The enquiry form. Posts to /api/enquiry, which records the enquiry (and any
 * PDF) in Notion and sends a branded confirmation email via Resend.
 *
 * Submit only ever posts to the API — it never opens a mail draft. On failure
 * it shows an error and points to the address link below the form.
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
      // Never open a mail draft. On any failure, show an error and point to the
      // address (which is a link below the form the visitor can choose to use).
      fail(result.error ?? `We could not submit that just now. Please email us at ${CONTACT_EMAIL}.`);
    } catch {
      fail(`We could not submit that just now. Please email us at ${CONTACT_EMAIL}.`);
    }
  }

  function fail(text: string) {
    setState('error');
    setMessage(text);
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
