/**
 * Every email the site sends is built to read as one of its plates.
 *
 * Email clients don't reliably load web fonts, so this uses the same fallback
 * families the site declares — Georgia for the serif display, a monospace stack
 * for the metadata — plus the exact five-token palette. Table layout and inline
 * styles because that is what email clients render consistently.
 */

const PAPER = '#efedea';
const INK = '#0a0a0a';
const COBALT = '#1e2edc';
const SURROUND = '#e5e5e5';
const MUTED = '#5a5957';

const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "'Courier New', ui-monospace, monospace";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * The shared sheet: masthead, cobalt eyebrow, serif heading, a body, a cobalt
 * rule, and the mono footer. Both emails are this shell with different bodies.
 */
function shell(opts: {
  preheader: string;
  tag: string;
  eyebrow: string;
  heading: string;
  bodyHtml: string;
}): string {
  const year = new Date().getUTCFullYear();
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
</head>
<body style="margin:0; padding:0; background:${SURROUND}; -webkit-text-size-adjust:100%;">
<div style="display:none; max-height:0; overflow:hidden; opacity:0;">${escapeHtml(opts.preheader)}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SURROUND};">
<tr><td align="center" style="padding:28px 16px;">

  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:100%; background:${PAPER}; border:1px solid rgba(10,10,10,0.14);">

    <tr>
      <td style="padding:22px 32px 18px; border-bottom:1px solid rgba(10,10,10,0.16);">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="font-family:${MONO}; font-size:15px; letter-spacing:3px; color:${INK}; font-weight:bold;">EIGENV</td>
          <td align="right" style="font-family:${MONO}; font-size:11px; letter-spacing:1px; color:${MUTED};">${escapeHtml(opts.tag)}</td>
        </tr></table>
      </td>
    </tr>

    <tr>
      <td style="padding:44px 32px 8px;">
        <div style="font-family:${MONO}; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:${COBALT}; margin-bottom:20px;">${escapeHtml(opts.eyebrow)} &middot; ${year}</div>
        <h1 style="margin:0; font-family:${SERIF}; font-weight:normal; font-size:40px; line-height:1.04; letter-spacing:-0.02em; color:${INK};">${opts.heading}</h1>
      </td>
    </tr>

    <tr><td style="padding:24px 32px 8px;">${opts.bodyHtml}</td></tr>

    <tr><td style="padding:32px 32px 0;"><div style="height:2px; background:${COBALT}; font-size:0; line-height:0;">&nbsp;</div></td></tr>

    <tr>
      <td style="padding:18px 32px 32px;">
        <div style="font-family:${MONO}; font-size:11px; letter-spacing:1px; color:${MUTED}; line-height:1.7;">
          EIGENV<br />SAN FRANCISCO, CALIFORNIA<br />
          <a href="mailto:ada@eigenv.ai" style="color:${COBALT}; text-decoration:none;">ADA@EIGENV.AI</a>
        </div>
      </td>
    </tr>

  </table>
</td></tr></table>
</body></html>`;
}

/** A mono-label / serif-value row for the enquiry details table. */
function detailRow(label: string, value: string, isLink = false): string {
  const shown = isLink
    ? `<a href="${escapeHtml(value)}" style="color:${COBALT}; text-decoration:none; word-break:break-all;">${escapeHtml(value)}</a>`
    : escapeHtml(value);
  return `<tr>
    <td style="padding:9px 0; border-bottom:1px solid rgba(10,10,10,0.12); width:120px; vertical-align:top; font-family:${MONO}; font-size:10px; letter-spacing:1px; text-transform:uppercase; color:${MUTED};">${escapeHtml(label)}</td>
    <td style="padding:9px 0 9px 16px; border-bottom:1px solid rgba(10,10,10,0.12); font-family:${SANS}; font-size:15px; color:${INK};">${shown}</td>
  </tr>`;
}

// --- Visitor confirmation --------------------------------------------------

export function enquiryConfirmationEmail(name: string) {
  const first = escapeHtml(name.trim().split(/\s+/)[0] || 'there');
  const bodyHtml = `
    <p style="margin:0 0 16px; font-family:${SANS}; font-size:16px; line-height:1.6; color:${INK};">We have your note and the details you shared. Someone will read it properly — not a bot — and be in touch soon.</p>
    <p style="margin:0; font-family:${SANS}; font-size:16px; line-height:1.6; color:${MUTED};">If anything changed or you want to add to it, just reply to this email. It reaches us directly.</p>`;

  return {
    subject: 'Thanks for reaching out — EIGENV',
    html: shell({
      preheader: 'We have your note. We will be in touch soon.',
      tag: 'CONFIRMATION',
      eyebrow: 'Received',
      heading: `Thanks for reaching&nbsp;out, ${first}.`,
      bodyHtml,
    }),
    text: [
      `Thanks for reaching out, ${name.trim() || 'there'}.`,
      '',
      'We have your note and the details you shared. We will be in touch soon.',
      '',
      'EIGENV — San Francisco, California',
      'ada@eigenv.ai',
    ].join('\n'),
  };
}

// --- Internal notification -------------------------------------------------

export type EnquiryDetails = {
  name: string;
  email: string;
  role: string | null;
  company: string | null;
  timing: string;
  lookingTo: string[];
  link: string | null;
  attachmentName: string | null;
  storedInNotion: boolean;
};

export function enquiryNotificationEmail(d: EnquiryDetails) {
  const rows = [
    detailRow('Email', d.email),
    d.company ? detailRow('Company', d.company) : '',
    d.role ? detailRow('Role', d.role) : '',
    detailRow('Timing', d.timing),
    d.lookingTo.length ? detailRow('Looking to', d.lookingTo.join(', ')) : '',
    d.link ? detailRow('Link', d.link, true) : '',
    detailRow('Attachment', d.attachmentName ?? 'none'),
    detailRow('Notion', d.storedInNotion ? 'Recorded' : 'Not recorded'),
  ].join('');

  const bodyHtml = `
    <p style="margin:0 0 20px; font-family:${SANS}; font-size:16px; line-height:1.6; color:${MUTED};">Reply to this email to reach them directly.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`;

  return {
    subject: `New enquiry — ${d.name}`,
    html: shell({
      preheader: `${d.name}${d.company ? ` · ${d.company}` : ''} — ${d.lookingTo.join(', ') || 'enquiry'}`,
      tag: 'ENQUIRY',
      eyebrow: 'New enquiry',
      heading: escapeHtml(d.name),
      bodyHtml,
    }),
    text: [
      `New enquiry — ${d.name}`,
      '',
      `Email: ${d.email}`,
      `Company: ${d.company ?? '—'}`,
      `Role: ${d.role ?? '—'}`,
      `Timing: ${d.timing}`,
      `Looking to: ${d.lookingTo.join(', ') || '—'}`,
      `Link: ${d.link ?? '—'}`,
      `Attachment: ${d.attachmentName ?? 'none'}`,
      `Notion: ${d.storedInNotion ? 'recorded' : 'not recorded'}`,
    ].join('\n'),
  };
}
