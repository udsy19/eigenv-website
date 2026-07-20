'use client';

import { useState } from 'react';
import { CONTACT_EMAIL, LOOKING_TO } from '@/content';
import { getSupabase, ENQUIRY_BUCKET } from '@/lib/supabase';
import styles from './LeadForm.module.css';

/**
 * The enquiry form.
 *
 * If Supabase is configured, the enquiry is written to the `enquiries` table
 * and any PDF is uploaded to storage — so the data reaches us the moment it is
 * submitted, rather than waiting on an email round-trip. A database webhook
 * then emails the team (see supabase/functions/notify-enquiry).
 *
 * If Supabase is not configured, it falls back to composing a mailto, so the
 * form always does something useful.
 */

const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB

type State = 'idle' | 'sending' | 'done' | 'error';

export default function LeadForm() {
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const get = (key: string) => String(data.get(key) ?? '').trim();

    const looking = LOOKING_TO.filter((o) => data.get(o.value)).map((o) => o.label);
    const file = data.get('attachment');
    const pdf = file instanceof File && file.size > 0 ? file : null;

    if (pdf) {
      if (pdf.type !== 'application/pdf') {
        fail('That attachment is not a PDF. Please attach a PDF, or share a link.');
        return;
      }
      if (pdf.size > MAX_PDF_BYTES) {
        fail('That PDF is over 10 MB. Please share a link to it instead.');
        return;
      }
    }

    const enquiry = {
      name: get('name'),
      email: get('email'),
      role: get('role') || null,
      company: get('company') || null,
      timing: get('timing') || 'ASAP',
      looking_to: looking,
      link: get('link') || null,
    };

    const supabase = getSupabase();

    if (!supabase) {
      composeMail(enquiry, pdf);
      return;
    }

    setState('sending');
    try {
      let attachmentPath: string | null = null;
      if (pdf) {
        // random, sanitised name — never trust the client filename in a path
        const safe = pdf.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
        attachmentPath = `${crypto.randomUUID()}-${safe}`;
        const upload = await supabase.storage
          .from(ENQUIRY_BUCKET)
          .upload(attachmentPath, pdf, { contentType: 'application/pdf' });
        if (upload.error) throw upload.error;
      }

      const insert = await supabase
        .from('enquiries')
        .insert({ ...enquiry, attachment_path: attachmentPath });
      if (insert.error) throw insert.error;

      setState('done');
      setMessage('Thank you — we have it. We will reply from ada@eigenv.ai.');
      form.reset();
    } catch {
      // never surface a raw backend error to the visitor; give them a way through
      composeMail(enquiry, pdf, 'We could not submit that automatically — opening your mail client instead.');
    }
  }

  function fail(text: string) {
    setState('error');
    setMessage(text);
  }

  function composeMail(
    enquiry: Record<string, unknown>,
    pdf: File | null,
    note?: string
  ) {
    const body = [
      `Name: ${enquiry.name}`,
      `Email: ${enquiry.email}`,
      `Role: ${enquiry.role ?? '—'}`,
      `Company: ${enquiry.company ?? '—'}`,
      `Timing: ${enquiry.timing}`,
      `Looking to: ${(enquiry.looking_to as string[]).join(', ') || '—'}`,
      `Link: ${enquiry.link ?? '—'}`,
      pdf ? `\n(You attached ${pdf.name} — please attach it to this email.)` : '',
    ].join('\n');
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `Enquiry from ${enquiry.name}`
    )}&body=${encodeURIComponent(body)}`;
    setState('done');
    setMessage(
      note ?? `Opening your mail client. If nothing happens, write to ${CONTACT_EMAIL}.`
    );
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
