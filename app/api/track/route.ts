import { NextResponse } from 'next/server';
import { UAParser } from 'ua-parser-js';

/**
 * Cookieless, first-party visit analytics → a Notion "Visitors" database.
 *
 * What it records: page path, referrer, campaign (UTM), coarse geo (country /
 * region / city, from Vercel's edge headers — the raw IP is never stored), and
 * device / browser / OS / language / screen / timezone.
 *
 * What it deliberately does NOT do: set any persistent identifier or cookie,
 * fingerprint across sessions, record inputs or keystrokes, or enrich against
 * cross-site or credit/fraud data. It is disclosed in the footer.
 */

export const runtime = 'nodejs';

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

const text = (value: string | null | undefined) =>
  value ? { rich_text: [{ text: { content: value.slice(0, 1900) } }] } : { rich_text: [] };

export async function POST(request: Request) {
  const token = process.env.NOTION_TOKEN;
  const db = process.env.NOTION_VISITORS_DATABASE_ID;
  // analytics is best-effort and must never affect the visitor — always 204
  if (!token || !db) return new NextResponse(null, { status: 204 });

  let payload: Record<string, unknown> = {};
  try {
    payload = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const h = request.headers;
  const ua = UAParser(h.get('user-agent') ?? '');
  const deviceType = ua.device.type; // undefined for desktop
  const device = deviceType === 'mobile' ? 'Mobile' : deviceType === 'tablet' ? 'Tablet' : 'Desktop';

  // Vercel edge geo headers — present in production, absent locally
  const country = h.get('x-vercel-ip-country') ?? '';
  const region = h.get('x-vercel-ip-country-region') ?? '';
  const city = decodeURIComponent(h.get('x-vercel-ip-city') ?? '');
  const tz = h.get('x-vercel-ip-timezone') ?? String(payload.timezone ?? '');

  const path = String(payload.path ?? '/');
  const referrer = String(payload.referrer ?? '');
  const campaign = String(payload.campaign ?? '');
  const screen = String(payload.screen ?? '');
  const language = String(payload.language ?? h.get('accept-language')?.split(',')[0] ?? '');

  // optional B2B company identification from IP (org-level, not a person)
  let company = '';
  const ipinfo = process.env.IPINFO_TOKEN;
  if (ipinfo) {
    const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim();
    if (ip) {
      try {
        const res = await fetch(`https://ipinfo.io/${ip}/org?token=${ipinfo}`);
        if (res.ok) company = (await res.text()).trim().replace(/^AS\d+\s*/, '');
      } catch {
        // enrichment is optional
      }
    }
  }

  const title = [city, country].filter(Boolean).join(', ') || 'Visit';

  const properties: Record<string, unknown> = {
    Visit: { title: [{ text: { content: title } }] },
    Path: text(path),
    Referrer: text(referrer),
    Campaign: text(campaign),
    Country: text(country),
    Region: text(region),
    City: text(city),
    Company: text(company),
    Device: { select: { name: device } },
    Browser: text([ua.browser.name, ua.browser.version].filter(Boolean).join(' ')),
    OS: text([ua.os.name, ua.os.version].filter(Boolean).join(' ')),
    Language: text(language),
    Screen: text(screen),
    Timezone: text(tz),
  };

  try {
    await fetch(`${NOTION_API}/pages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parent: { database_id: db }, properties }),
    });
  } catch (error) {
    console.error('[track] notion write failed', error);
  }

  return new NextResponse(null, { status: 204 });
}
