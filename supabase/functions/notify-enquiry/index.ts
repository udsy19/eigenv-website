// Emails the team when a new enquiry lands — this is the "does Supabase alert
// us?" piece. Wire it to the `enquiries` table with a Database Webhook
// (Database → Webhooks → insert → HTTP POST to this function's URL).
//
// Secrets (Edge Functions → Secrets):
//   RESEND_API_KEY   an API key from resend.com
//   ALERT_TO         where alerts go, e.g. ada@eigenv.ai
//   ALERT_FROM       a verified sender, e.g. notify@eigenv.ai
//   WEBHOOK_SECRET   a shared secret; set the same value as a custom header
//                    on the webhook so only Supabase can invoke this
//
// Deploy: supabase functions deploy notify-enquiry --no-verify-jwt

interface Enquiry {
  name: string;
  email: string;
  role: string | null;
  company: string | null;
  timing: string | null;
  looking_to: string[] | null;
  link: string | null;
  attachment_path: string | null;
}

Deno.serve(async (req: Request) => {
  // Fail closed: an unset secret rejects everything rather than waving it
  // through. The function is deployed --no-verify-jwt, so this header is the
  // only thing gating a publicly-invokable endpoint.
  const secret = Deno.env.get('WEBHOOK_SECRET');
  if (!secret || req.headers.get('x-webhook-secret') !== secret) {
    return new Response('forbidden', { status: 403 });
  }

  const payload = await req.json();
  const row: Enquiry = payload.record ?? payload;

  const attachmentNote = row.attachment_path
    ? `Attachment: ${Deno.env.get('SUPABASE_URL')}/storage/v1/object/enquiry-attachments/${row.attachment_path}`
    : 'Attachment: none';

  const text = [
    `Name: ${row.name}`,
    `Email: ${row.email}`,
    `Role: ${row.role ?? '—'}`,
    `Company: ${row.company ?? '—'}`,
    `Timing: ${row.timing ?? 'ASAP'}`,
    `Looking to: ${(row.looking_to ?? []).join(', ') || '—'}`,
    `Link: ${row.link ?? '—'}`,
    attachmentNote,
  ].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: Deno.env.get('ALERT_FROM'),
      to: Deno.env.get('ALERT_TO'),
      reply_to: row.email,
      subject: `New enquiry — ${row.name}`,
      text,
    }),
  });

  if (!res.ok) {
    return new Response(`mail failed: ${await res.text()}`, { status: 502 });
  }
  return new Response('ok');
});
