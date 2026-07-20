import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { COMPANY_EMAIL_MESSAGE, isCompanyEmail } from '@/lib/company-email';
import { enquiryConfirmationEmail, enquiryNotificationEmail } from '@/lib/enquiry-email';
import { createEnquiryPage, uploadPdfToNotion, type EnquiryRecord } from '@/lib/notion';

export const runtime = 'nodejs';

const MAX_PDF_BYTES = 10 * 1024 * 1024;
const LOOKING_LABELS: Record<string, string> = {
  sell: 'Sell a company',
  consulting: 'Consulting',
};

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  const field = (key: string) => String(form.get(key) ?? '').trim();
  const name = field('name');
  const email = field('email');

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 422 });
  }
  // the real gate — the client's check is only for fast feedback
  if (!isCompanyEmail(email)) {
    return NextResponse.json({ error: COMPANY_EMAIL_MESSAGE }, { status: 422 });
  }

  const lookingTo = Object.keys(LOOKING_LABELS)
    .filter((key) => form.get(key))
    .map((key) => LOOKING_LABELS[key]);

  const record: EnquiryRecord = {
    name,
    email,
    role: field('role') || null,
    company: field('company') || null,
    timing: field('timing') || 'ASAP',
    lookingTo,
    link: field('link') || null,
  };

  const attachment = form.get('attachment');
  let pdf: File | null = null;
  if (attachment instanceof File && attachment.size > 0) {
    if (attachment.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Attachments must be a PDF.' }, { status: 422 });
    }
    if (attachment.size > MAX_PDF_BYTES) {
      return NextResponse.json(
        { error: 'That PDF is over 10 MB. Please share a link instead.' },
        { status: 422 }
      );
    }
    // don't trust the browser-declared MIME type — verify the %PDF- signature
    const signature = new Uint8Array(await attachment.slice(0, 5).arrayBuffer());
    if (String.fromCharCode(...signature) !== '%PDF-') {
      return NextResponse.json({ error: 'That file is not a valid PDF.' }, { status: 422 });
    }
    pdf = attachment;
  }

  const notionToken = process.env.NOTION_TOKEN;
  const notionDb = process.env.NOTION_DATABASE_ID;
  const resendKey = process.env.RESEND_API_KEY;

  // Nothing wired up (a fork, or local without env) — tell the client to fall
  // back to a mailto so the enquiry is never silently lost.
  if (!notionToken && !resendKey) {
    return NextResponse.json({ ok: false, fallback: true });
  }

  let stored = false;
  if (notionToken && notionDb) {
    try {
      const fileId = pdf ? await uploadPdfToNotion(notionToken, pdf) : null;
      await createEnquiryPage(notionToken, notionDb, record, fileId, pdf?.name ?? 'attachment.pdf');
      stored = true;
    } catch (error) {
      console.error('[enquiry] notion write failed', error);
    }
  }

  let emailed = false;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const from = process.env.RESEND_FROM ?? 'EIGENV <onboarding@resend.dev>';
      const { subject, html, text } = enquiryConfirmationEmail(name);
      const sent = await resend.emails.send({
        from,
        to: email,
        replyTo: 'ada@eigenv.ai',
        subject,
        html,
        text,
      });
      emailed = !sent.error;
      if (sent.error) console.error('[enquiry] resend error', sent.error);

      // optional internal notification — branded, same as everything else
      const alertTo = process.env.ALERT_TO;
      if (alertTo) {
        const note = enquiryNotificationEmail({
          ...record,
          attachmentName: pdf?.name ?? null,
          storedInNotion: stored,
        });
        await resend.emails.send({
          from,
          to: alertTo,
          replyTo: email,
          subject: note.subject,
          html: note.html,
          text: note.text,
        });
      }
    } catch (error) {
      console.error('[enquiry] resend failed', error);
    }
  }

  if (!stored && !emailed) {
    return NextResponse.json(
      { error: 'We could not record that just now.', fallback: true },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, stored, emailed });
}
