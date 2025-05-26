
import { createClient } from '@supabase/supabase-js';

// URL e chave pública anônima do projeto Supabase
const supabaseUrl = 'https://jqnarznabyiyngcdqcff.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxbmFyem5hYnlpeW5nY2RxY2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4OTk5OTAsImV4cCI6MjA1OTQ3NTk5MH0.g_Cq1x29MLlq46SaszcCL65FwVJQd7Qyv4MPIy1HwQg';

// Cria o cliente do Supabase com configurações melhoradas para autenticação
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
    // Configurações adicionais para melhor handling de tokens
    debug: process.env.NODE_ENV === 'development',
    storageKey: 'bestcode-auth-token'
  },
  global: {
    headers: {
      'x-client-info': 'bestcode-web-app'
    }
  },
  // Configuração de retry para requests
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Adicionar listener para mudanças de autenticação
supabase.auth.onAuthStateChange((event, session) => {
  console.log('[Supabase Auth] Event:', event, 'Session:', session ? 'present' : 'null');
  
  if (event === 'SIGNED_OUT') {
    // Limpar storage local quando usuário faz logout
    localStorage.removeItem('bestcode-auth-token');
    console.log('[Supabase Auth] User signed out, cleared local storage');
  }
  
  if (event === 'TOKEN_REFRESHED') {
    console.log('[Supabase Auth] Token refreshed successfully');
  }
  
  if (event === 'SIGNED_IN') {
    console.log('[Supabase Auth] User signed in successfully');
  }
});

// Função para verificar se a sessão é válida
export const isSessionValid = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('[Supabase Auth] Session validation error:', error);
      return false;
    }
    
    if (!session) {
      console.log('[Supabase Auth] No active session found');
      return false;
    }
    
    // Verificar se o token não está expirado
    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at && session.expires_at < now) {
      console.log('[Supabase Auth] Session expired, attempting refresh');
      
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('[Supabase Auth] Token refresh failed:', refreshError);
        return false;
      }
      
      console.log('[Supabase Auth] Token refreshed successfully');
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('[Supabase Auth] Session validation error:', error);
    return false;
  }
};

// Função para fazer logout com limpeza completa
export const performLogout = async () => {
  try {
    console.log('[Supabase Auth] Performing logout...');
    
    // Fazer logout no Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('[Supabase Auth] Logout error:', error);
    }
    
    // Limpar storage local independentemente de erro
    localStorage.removeItem('bestcode-auth-token');
    localStorage.removeItem('supabase.auth.token');
    
    // Limpar outros dados relacionados à sessão
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-') || key.includes('supabase')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('[Supabase Auth] Logout completed and storage cleared');
    return { success: true };
  } catch (error) {
    console.error('[Supabase Auth] Logout error:', error);
    return { success: false, error };
  }
};

// Log debug info about environment
console.log('[Supabase] Cliente inicializado em:', process.env.NODE_ENV === 'production' ? 'produção' : 'desenvolvimento');
