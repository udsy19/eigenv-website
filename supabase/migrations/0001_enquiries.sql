-- Enquiries captured by the contact form, plus a private bucket for PDFs.
--
-- Security model: the browser uses the public anon key. That is safe only
-- because RLS lets anon do exactly one thing here — INSERT an enquiry and
-- upload an attachment. It can read, update or delete nothing. So a leaked
-- anon key cannot exfiltrate a single enquiry.

create table if not exists public.enquiries (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null check (char_length(name) between 1 and 200),
  email           text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  role            text check (char_length(role) <= 200),
  company         text check (char_length(company) <= 200),
  timing          text check (char_length(timing) <= 100),
  looking_to      text[] not null default '{}',
  link            text check (char_length(link) <= 2000),
  attachment_path text check (char_length(attachment_path) <= 400)
);

alter table public.enquiries enable row level security;

-- anon and signed-in users may submit; nobody may read/change via the API.
-- The team reads enquiries in the Supabase dashboard (service role bypasses RLS).
drop policy if exists "anyone can submit an enquiry" on public.enquiries;
create policy "anyone can submit an enquiry"
  on public.enquiries for insert
  to anon, authenticated
  with check (true);

-- Private bucket. `public => false` means no anonymous read; the anon key can
-- upload but cannot list or download.
insert into storage.buckets (id, name, public)
values ('enquiry-attachments', 'enquiry-attachments', false)
on conflict (id) do nothing;

drop policy if exists "anyone can upload an attachment" on storage.objects;
create policy "anyone can upload an attachment"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'enquiry-attachments');
