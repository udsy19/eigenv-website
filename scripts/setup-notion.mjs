/**
 * Creates the EIGENV enquiries database in Notion with exactly the schema the
 * form expects (see lib/notion.ts), then prints the database id to put in
 * NOTION_DATABASE_ID.
 *
 * Run once:
 *   NOTION_TOKEN=secret_xxx NOTION_PARENT_PAGE_ID=xxxxxxxx node scripts/setup-notion.mjs
 *
 * NOTION_PARENT_PAGE_ID is any Notion page you have shared with the integration
 * — the new database is created inside it. Copy the id from the page URL
 * (the 32-char hex after the title).
 */

const token = process.env.NOTION_TOKEN;
const parent = process.env.NOTION_PARENT_PAGE_ID;

if (!token || !parent) {
  console.error(
    'Missing env. Run:\n  NOTION_TOKEN=secret_xxx NOTION_PARENT_PAGE_ID=xxxx node scripts/setup-notion.mjs'
  );
  process.exit(1);
}

const body = {
  parent: { type: 'page_id', page_id: parent },
  title: [{ type: 'text', text: { content: 'EIGENV — Enquiries' } }],
  properties: {
    Name: { title: {} },
    Email: { email: {} },
    Role: { rich_text: {} },
    Company: { rich_text: {} },
    Timing: { rich_text: {} },
    'Looking to': {
      multi_select: {
        options: [
          { name: 'Sell a company', color: 'blue' },
          { name: 'Consulting', color: 'default' },
        ],
      },
    },
    Link: { url: {} },
    Attachment: { files: {} },
    Submitted: { created_time: {} },
  },
};

const res = await fetch('https://api.notion.com/v1/databases', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

const json = await res.json();
if (!res.ok) {
  console.error(`Notion error ${res.status}:`, json.message ?? json);
  process.exit(1);
}

console.log('\n✅ Database created.\n');
console.log('   Set this in Vercel and .env.local:');
console.log(`   NOTION_DATABASE_ID=${json.id.replace(/-/g, '')}\n`);
console.log('   Open it:', json.url, '\n');
