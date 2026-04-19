import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function createSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for build time - actual runtime will have env vars
    return createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: { persistSession: false },
    });
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: typeof window !== 'undefined',
    },
  });
}

export const supabase = createSupabaseClient();
