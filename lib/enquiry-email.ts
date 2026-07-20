/**
 * The confirmation email, built to read as one of the site's plates.
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

export function enquiryConfirmationEmail(name: string) {
  const first = escapeHtml(name.trim().split(/\s+/)[0] || 'there');

  const subject = 'Thanks for reaching out — EIGENV';

  const text = [
    `Thanks for reaching out, ${name.trim() || 'there'}.`,
    '',
    'We have your note and the details you shared. We will be in touch soon.',
    '',
    'EIGENV — San Francisco, California',
    'ada@eigenv.ai',
  ].join('\n');

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>${subject}</title>
</head>
<body style="margin:0; padding:0; background:${SURROUND}; -webkit-text-size-adjust:100%;">
<!-- preheader -->
<div style="display:none; max-height:0; overflow:hidden; opacity:0;">We have your note. We will be in touch soon.</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SURROUND};">
<tr>
<td align="center" style="padding:28px 16px;">

  <!-- the sheet -->
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:100%; background:${PAPER}; border:1px solid rgba(10,10,10,0.14);">

    <!-- masthead -->
    <tr>
      <td style="padding:22px 32px 18px; border-bottom:1px solid rgba(10,10,10,0.16);">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-family:${MONO}; font-size:15px; letter-spacing:3px; color:${INK}; font-weight:bold;">EIGENV</td>
            <td align="right" style="font-family:${MONO}; font-size:11px; letter-spacing:1px; color:${MUTED};">CONFIRMATION</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- body -->
    <tr>
      <td style="padding:44px 32px 8px;">
        <div style="font-family:${MONO}; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:${COBALT}; margin-bottom:20px;">Received &middot; ${new Date().getUTCFullYear()}</div>
        <h1 style="margin:0; font-family:${SERIF}; font-weight:normal; font-size:40px; line-height:1.04; letter-spacing:-0.02em; color:${INK};">Thanks for reaching&nbsp;out, ${first}.</h1>
      </td>
    </tr>

    <tr>
      <td style="padding:24px 32px 8px;">
        <p style="margin:0 0 16px; font-family:${SANS}; font-size:16px; line-height:1.6; color:${INK};">We have your note and the details you shared. Someone will read it properly — not a bot — and be in touch soon.</p>
        <p style="margin:0; font-family:${SANS}; font-size:16px; line-height:1.6; color:${MUTED};">If anything changed or you want to add to it, just reply to this email. It reaches us directly.</p>
      </td>
    </tr>

    <!-- cobalt rule -->
    <tr>
      <td style="padding:32px 32px 0;">
        <div style="height:2px; background:${COBALT}; font-size:0; line-height:0;">&nbsp;</div>
      </td>
    </tr>

    <!-- footer meta -->
    <tr>
      <td style="padding:18px 32px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-family:${MONO}; font-size:11px; letter-spacing:1px; color:${MUTED}; line-height:1.7;">
              EIGENV<br />
              SAN FRANCISCO, CALIFORNIA<br />
              <a href="mailto:ada@eigenv.ai" style="color:${COBALT}; text-decoration:none;">ADA@EIGENV.AI</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>

  <!-- surround caption -->
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:100%;">
    <tr>
      <td style="padding:16px 4px; font-family:${MONO}; font-size:10px; letter-spacing:1px; color:${MUTED};">
        This is a confirmation that we received your enquiry. You can reply to reach us directly.
      </td>
    </tr>
  </table>

</td>
</tr>
</table>
</body>
</html>`;

  return { subject, html, text };
}
