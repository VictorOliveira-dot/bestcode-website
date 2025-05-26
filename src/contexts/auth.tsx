import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, isSessionValid, performLogout } from '@/integrations/supabase/client';
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

  // Função melhorada para buscar dados do usuário
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
        };
        
        console.log('[Auth] User data fetched successfully:', authUser);
        setUser(authUser);
        return authUser;
      } else {
        console.error('[Auth] No user data found');
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error('[Auth] Error fetching user data:', error);
      setUser(null);
      return null;
    }
  };

  // Verificar sessão inicial com retry
  useEffect(() => {
    let mounted = true;
    
    const checkInitialSession = async () => {
      try {
        console.log('[Auth] Checking initial session...');
        
        // Verificar se a sessão é válida
        const sessionValid = await isSessionValid();
        
        if (!sessionValid) {
          console.log('[Auth] No valid session found');
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[Auth] Session error:', error);
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        if (session?.user) {
          console.log('[Auth] Valid session found, fetching user data');
          await fetchAndSetUserData(session.user);
        } else {
          console.log('[Auth] No session found');
          if (mounted) setUser(null);
        }
      } catch (error) {
        console.error('[Auth] Error checking initial session:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkInitialSession();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Listener para mudanças de autenticação
  useEffect(() => {
    console.log('[Auth] Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] Auth state changed:', event, session ? 'session present' : 'no session');
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('[Auth] User signed in, fetching data');
          await fetchAndSetUserData(session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log('[Auth] User signed out');
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('[Auth] Token refreshed, updating user data');
          await fetchAndSetUserData(session.user);
        }
        
        setLoading(false);
      }
    );

    return () => {
      console.log('[Auth] Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log('[Auth] Attempting login for:', email);
      setLoading(true);

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
        // O listener onAuthStateChange irá cuidar de definir o usuário
        return { success: true };
      }

      return { success: false, message: 'Erro inesperado durante o login.' };
    } catch (error: any) {
      console.error('[Auth] Login exception:', error);
      return { 
        success: false, 
        message: error.message || 'Erro de conexão. Verifique sua internet.' 
      };
    } finally {
      setLoading(false);
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
      setLoading(true);
      
      // Usar a função de logout melhorada
      await performLogout();
      
      // Limpar estado local
      setUser(null);
      
      console.log('[Auth] Logout completed successfully');
    } catch (error) {
      console.error('[Auth] Logout error:', error);
      // Mesmo com erro, limpar o estado local
      setUser(null);
    } finally {
      setLoading(false);
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
