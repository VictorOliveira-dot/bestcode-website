
import { createClient } from "@supabase/supabase-js";

// Replace with your project's actual URL and anon key
const SUPABASE_URL = "https://jqnarznabyiyngcdqcff.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxbmFyem5hYnlpeW5nY2RxY2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4OTk5OTAsImV4cCI6MjA1OTQ3NTk5MH0.g_Cq1x29MLlq46SaszcCL65FwVJQd7Qyv4MPIy1HwQg";

// Debug Supabase connection
console.log('[Supabase] Initializing client with URL:', SUPABASE_URL);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Test the connection and log the result for debugging purposes
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('[Supabase] Error checking session:', error);
  } else {
    console.log('[Supabase] Connection successful. Session exists:', !!data.session);
    if (data.session) {
      console.log('[Supabase] User ID:', data.session.user.id);
    }
  }
});

console.log('[Supabase] Client initialized');
