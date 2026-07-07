import { createClient } from '@supabase/supabase-js';

// These two values come from your Supabase project settings
// (Project Settings -> API). They are read from environment
// variables so the same code works locally and on Vercel.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // This warning helps students notice a missing .env.local file
  // instead of getting a confusing runtime error later.
  console.warn(
    'Supabase environment variables are missing. ' +
      'Check that .env.local (or your Vercel project settings) ' +
      'defines NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

// A single shared Supabase client used across the whole app.
// The anon key is safe to expose in the browser as long as
// Row Level Security (RLS) policies are set up correctly.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
