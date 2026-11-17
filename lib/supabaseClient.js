import { createClient } from '@supabase/supabase-js';

let anonClient = null;

/**
 * Returns a Supabase client configured strictly with the anonymous key.
 * Enforces Row Level Security (RLS) on all public reads.
 * Returns null when Supabase env vars aren't set, ensuring zero downtime
 * by letting callers fall back to bundled data.
 */
export function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Security check: warn if the service-role key is present in public hosting runtime
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NODE_ENV === 'production') {
    console.warn(
      '[SECURITY WARNING] SUPABASE_SERVICE_ROLE_KEY detected in runtime environment. Client read operations must use SUPABASE_ANON_KEY to preserve Row Level Security.'
    );
  }

  if (!url || !anonKey) return null;

  if (!anonClient) {
    anonClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        // Enforce 4-second timeout on all database requests
        fetch: (fetchUrl, options = {}) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);
          return fetch(fetchUrl, {
            ...options,
            signal: options.signal || controller.signal,
          }).finally(() => clearTimeout(timeoutId));
        },
      },
    });
  }

  return anonClient;
}
