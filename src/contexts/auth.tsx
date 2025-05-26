
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { fetchUserData, registerUser } from '@/services/authService';
import { AuthUser, AuthContextType } from './types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar dados do usuário
  const fetchAndSetUserData = async (supabaseUser: User) => {
    try {
      console.log('[Auth] Fetching user data for:', supabaseUser.id);
      
      const userData = await fetchUserData(supabaseUser);
      
      if (userData) {
        const authUser: AuthUser = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: userData.name,
          role: userData.role as 'admin' | 'teacher' | 'student',
          is_active: userData.is_active,
        };
        
        console.log('[Auth] User data set:', authUser);
        setUser(authUser);
      } else {
        console.error('[Auth] No user data found');
        setUser(null);
      }
    } catch (error) {
      console.error('[Auth] Error fetching user data:', error);
      setUser(null);
    }
  };

  // Configurar autenticação
  useEffect(() => {
    console.log('[Auth] Initializing auth...');
    
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] Auth state changed:', event, 'Session:', session ? 'present' : 'null');
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('[Auth] User signed in');
          await fetchAndSetUserData(session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log('[Auth] User signed out');
          setUser(null);
        }
      }
    );

    // Verificar sessão inicial
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[Auth] Error getting session:', error);
        } else if (session?.user) {
          console.log('[Auth] Initial session found');
          await fetchAndSetUserData(session.user);
        } else {
          console.log('[Auth] No initial session');
        }
      } catch (error) {
        console.error('[Auth] Error checking initial session:', error);
      } finally {
        // Sempre finalizar loading
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log('[Auth] Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log('[Auth] Attempting login for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('[Auth] Login error:', error);
        
        let message = 'Erro ao fazer login. Tente novamente.';
        
        if (error.message.includes('Invalid login credentials')) {
          message = 'Email ou senha incorretos.';
        } else if (error.message.includes('Email not confirmed')) {
          message = 'Email não confirmado. Verifique sua caixa de entrada.';
        } else if (error.message.includes('Too many requests')) {
          message = 'Muitas tentativas. Tente novamente em alguns minutos.';
        }
        
        return { success: false, message };
      }

      if (data.user) {
        console.log('[Auth] Login successful');
        return { success: true };
      }

      return { success: false, message: 'Erro inesperado durante o login.' };
    } catch (error: any) {
      console.error('[Auth] Login exception:', error);
      return { 
        success: false, 
        message: error.message || 'Erro de conexão. Verifique sua internet.' 
      };
    }
  };

  const register = async (data: { email: string; password: string; name: string; role: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log('[Auth] Attempting registration for:', data.email);
      setLoading(true);

      const result = await registerUser(data);

      if (result.success) {
        console.log('[Auth] Registration successful');
        return { success: true };
      }

      return { success: false, message: result.message };
    } catch (error: any) {
      console.error('[Auth] Registration exception:', error);
      return { 
        success: false, 
        message: error.message || 'Erro de conexão durante o cadastro.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('[Auth] Performing logout');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('[Auth] Logout error:', error);
      }
      
      setUser(null);
      
      console.log('[Auth] Logout completed');
    } catch (error) {
      console.error('[Auth] Logout error:', error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    register,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
