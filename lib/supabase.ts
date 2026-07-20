import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser Supabase client, created only when the project is configured.
 *
 * The anon key is public by design — it is safe in the client *because* Row
 * Level Security restricts what it can do (see supabase/migrations). The form
 * can INSERT an enquiry and upload a PDF; it can read nothing back. Nothing
 * secret lives here.
 *
 * When the env vars are absent (local dev without a project, or a fork) this is
 * null and the form falls back to composing a mailto — so the site never
 * depends on Supabase being provisioned to function.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const ENQUIRY_BUCKET = 'enquiry-attachments';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!client) {
    client = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}

export const isSupabaseConfigured = Boolean(url && anonKey);
