/**
 * Minimal Notion REST client for one job: record an enquiry, with its PDF, as a
 * row in a Notion database. Uses fetch rather than the SDK so the shape is
 * explicit and version-stable.
 *
 * The database must have these properties (type in brackets):
 *   Name (title) · Email (email) · Role (text) · Company (text) ·
 *   Timing (text) · Looking to (multi-select) · Link (url) · Attachment (files)
 */

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

function headers(token: string, json = true): Record<string, string> {
  const h: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Notion-Version': NOTION_VERSION,
  };
  if (json) h['Content-Type'] = 'application/json';
  return h;
}

/** Upload a PDF via Notion's File Upload API; returns the file_upload id. */
export async function uploadPdfToNotion(token: string, file: File): Promise<string> {
  const create = await fetch(`${NOTION_API}/file_uploads`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ filename: file.name, content_type: 'application/pdf' }),
  });
  if (!create.ok) throw new Error(`notion file_uploads create ${create.status}`);
  const { id, upload_url } = (await create.json()) as { id: string; upload_url: string };

  const body = new FormData();
  body.append('file', file, file.name);
  // no explicit Content-Type — fetch sets the multipart boundary
  const send = await fetch(upload_url, { method: 'POST', headers: headers(token, false), body });
  if (!send.ok) throw new Error(`notion file_uploads send ${send.status}`);

  return id;
}

export type EnquiryRecord = {
  name: string;
  email: string;
  role: string | null;
  company: string | null;
  timing: string;
  lookingTo: string[];
  link: string | null;
};

export async function createEnquiryPage(
  token: string,
  databaseId: string,
  data: EnquiryRecord,
  fileUploadId: string | null,
  attachmentName: string
): Promise<void> {
  const properties: Record<string, unknown> = {
    Name: { title: [{ text: { content: data.name } }] },
    Email: { email: data.email },
    Timing: { rich_text: [{ text: { content: data.timing } }] },
  };
  if (data.role) properties.Role = { rich_text: [{ text: { content: data.role } }] };
  if (data.company) properties.Company = { rich_text: [{ text: { content: data.company } }] };
  if (data.lookingTo.length)
    properties['Looking to'] = { multi_select: data.lookingTo.map((name) => ({ name })) };
  if (data.link) properties.Link = { url: data.link };
  if (fileUploadId)
    properties.Attachment = {
      files: [{ name: attachmentName, type: 'file_upload', file_upload: { id: fileUploadId } }],
    };

  const res = await fetch(`${NOTION_API}/pages`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ parent: { database_id: databaseId }, properties }),
  });
  if (!res.ok) throw new Error(`notion pages ${res.status}: ${await res.text()}`);
}
