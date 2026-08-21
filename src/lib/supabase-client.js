/**
 * Sankalp - Supabase Browser Client
 * 
 * Provides client-side Supabase authentication, real-time channels,
 * and database access for React Client Components.
 */

import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates and returns a browser Supabase client.
 * Uses public environment variables for URL and anonymous key.
 * 
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      'Supabase credentials missing: Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export default createClient;
