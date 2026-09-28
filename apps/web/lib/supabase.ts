/**
 * ARTHAX Sovereign Web Client — Supabase Configuration
 * Project Ref: qbhwplseiiqprbvcdgkr
 */

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qbhwplseiiqprbvcdgkr.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Returns whether Supabase client authentication is available on the frontend.
 */
export function isSupabaseClientConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
