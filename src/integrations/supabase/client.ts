
import { createClient } from '@supabase/supabase-js';

// URL e chave pública anônima do projeto Supabase
const supabaseUrl = 'https://jqnarznabyiyngcdqcff.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxbmFyem5hYnlpeW5nY2RxY2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4OTk5OTAsImV4cCI6MjA1OTQ3NTk5MH0.g_Cq1x29MLlq46SaszcCL65FwVJQd7Qyv4MPIy1HwQg';

// Cria o cliente do Supabase com as configurações adequadas para autenticação
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage, // Revert to localStorage for auth storage
    persistSession: true,  // Allow session persistence for logins to work
    autoRefreshToken: true, // Enable auto token refresh
    detectSessionInUrl: false, // Don't detect session in URL
    flowType: 'pkce' // Use the PKCE flow for authentication
  }
});

// Log debug info about environment
// console.log('[Supabase] Cliente inicializado em: ', process.env.NODE_ENV === 'production' ? 'produção' : 'desenvolvimento');
