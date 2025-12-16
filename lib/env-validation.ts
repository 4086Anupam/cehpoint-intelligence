// Environment Variable Validation
// This ensures all required environment variables are present

export function validateEnv() {
  const requiredEnvVars = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
  };

  const missing: string[] = [];

  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please add these to your .env.local file or deployment environment.`
    );
  }

  return true;
}

// Call this in API routes to ensure environment is configured
export function requireEnv<T>(value: T , name: string): T {
  console.log(value);
  
  if (value === undefined || value === null || value === '') {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value;
}

// Supabase validation
export function validateSupabaseEnv() {  
  const supabaseVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  };

  const missing: string[] = [];

  Object.entries(supabaseVars).forEach(([key, value]) => {
    if (!value) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Supabase not configured. Missing: ${missing.join(', ')}\n` +
      `Add these environment variables:\n` +
      `- NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL\n` +
      `- NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anon key\n` +
      `- SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key (for server-side operations)\n` +
      `See: https://app.supabase.com -> Settings -> API`
    );
  }

  return true;
}

// Export configuration object
export const env = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};
