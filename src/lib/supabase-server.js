/**
 * Sankalp - Supabase Server Client & Admin Client
 * 
 * Provides server-side Supabase clients for Next.js App Router:
 * - createServerClient: User-scoped client respecting RLS and session cookies (Route Handlers, Server Components)
 * - createAdminClient: Privileged client using SUPABASE_SERVICE_ROLE_KEY to bypass RLS (matching engine, admin actions, cron syncs)
 */

import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Creates a server-side Supabase client that reads and updates session cookies.
 * Respects Row-Level Security (RLS) according to the authenticated user.
 * 
 * @returns {Promise<import('@supabase/supabase-js').SupabaseClient>}
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables.'
    );
  }

  return createSupabaseServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if middleware handles session refreshing.
          }
        },
      },
    }
  );
}

/**
 * Creates an admin-level Supabase client using the service role key.
 * ⚠️ WARNING: Bypasses Row Level Security (RLS).
 * Only use in secure server contexts (e.g. backend matching engine, SACHET feed ingestion, admin moderation).
 * 
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.'
    );
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export default createServerClient;
