
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

  useEffect(() => {
    console.log('[Auth] Starting initialization...');
    
    let mounted = true;

    const initAuth = async () => {
      try {
        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[Auth] Error getting session:', error);
        } else if (session?.user && mounted) {
          console.log('[Auth] Found existing session');
          await handleUserSession(session.user);
        } else {
          console.log('[Auth] No existing session');
        }
      } catch (error) {
        console.error('[Auth] Error in initAuth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('[Auth] Loading set to false');
        }
      }
    };

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] Auth state changed:', event);
        
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          await handleUserSession(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Initialize
    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleUserSession = async (supabaseUser: User) => {
    try {
      const userData = await fetchUserData(supabaseUser);
      
      if (userData) {
        const authUser: AuthUser = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: userData.name,
          role: userData.role as 'admin' | 'teacher' | 'student',
          is_active: userData.is_active,
        };
        
        setUser(authUser);
        console.log('[Auth] User set:', authUser.email);
      }
    } catch (error) {
      console.error('[Auth] Error handling user session:', error);
    }
  };

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
      const result = await registerUser(data);
      return result;
    } catch (error: any) {
      console.error('[Auth] Registration exception:', error);
      return { 
        success: false, 
        message: error.message || 'Erro de conexão durante o cadastro.' 
      };
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
