import { createClient } from '@supabase/supabase-js';
import { env, requireEnv } from './env-validation';

const supabaseUrl = requireEnv(env.supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL') || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = requireEnv(env.supabaseAnonKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY') || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase instance configured for OTP (no magic links)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable magic link detection since we're using OTP
  },
});

// Server-side Supabase instance (use only in API routes)
export function getServiceSupabase() {
  const serviceKey = requireEnv(env.supabaseServiceKey, 'SUPABASE_SERVICE_ROLE_KEY') || process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
