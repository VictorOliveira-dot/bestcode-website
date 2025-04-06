
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client with error handling
let supabase;

// Only create the client if we have the URL and key
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error('Supabase URL and/or anon key are missing. Please set the environment variables.');
  
  // Create a mock client that returns empty data
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase configuration is missing') }),
      signOut: () => Promise.resolve({ error: null }),
      signUp: () => Promise.resolve({ data: null, error: new Error('Supabase configuration is missing') })
    },
    from: () => ({
      select: () => ({ match: () => ({ data: [], error: null }) }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      eq: () => ({ data: null, error: null }),
      single: () => Promise.resolve({ data: null, error: null }),
      order: () => ({ data: [], error: null }),
      maybeSingle: () => Promise.resolve({ data: null, error: null })
    })
  };
}

export { supabase };
