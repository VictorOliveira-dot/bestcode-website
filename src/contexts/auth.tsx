import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { loginUser, logoutUser, fetchUserData, registerUser } from '@/services/authService';
import { AuthUser, LoginResult } from './types/auth';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  register: (data: { email: string; password: string; name: string; role: string }) => Promise<{ success: boolean; message?: string }>;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('[Auth] Current state:', { user: user?.email, loading });

  useEffect(() => {
    console.log('[Auth] Initializing auth state...');
    
    let mounted = true;

    // Set up auth state listener primeiro
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Supabase Auth] Event:', event, 'Session:', session ? 'present' : 'null');
        
        if (!mounted) return;

        if (event === 'SIGNED_OUT') {
          console.log('[Auth] User signed out, clearing state');
          setUser(null);
          setSession(null);
          setLoading(false);
          return;
        }

        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          console.log('[Auth] User signed in, fetching data for:', session.user.email);
          
          try {
            const userData = await fetchUserData(session.user);
            if (userData && mounted) {
              const authUser: AuthUser = {
                id: session.user.id,
                email: session.user.email || '',
                name: userData.name,
                role: userData.role as 'admin' | 'teacher' | 'student',
              };
              console.log('[Auth] Setting user data:', authUser);
              setUser(authUser);
              setSession(session);
            }
          } catch (error) {
            console.error('[Auth] Error fetching user data:', error);
          }
        } else if (!session) {
          console.log('[Auth] No session, clearing user');
          setUser(null);
          setSession(null);
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Verificar sessão inicial
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[Auth] Error getting initial session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        console.log('[Auth] Initial session check:', initialSession ? 'found' : 'not found');

        if (initialSession?.user && mounted) {
          console.log('[Auth] Processing initial session for:', initialSession.user.email);
          
          const userData = await fetchUserData(initialSession.user);
          if (userData && mounted) {
            const authUser: AuthUser = {
              id: initialSession.user.id,
              email: initialSession.user.email || '',
              name: userData.name,
              role: userData.role as 'admin' | 'teacher' | 'student',
            };
            console.log('[Auth] Setting initial user data:', authUser);
            setUser(authUser);
            setSession(initialSession);
          }
        }

        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('[Auth] Error in initialization:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Executar inicialização
    initializeAuth();

    return () => {
      console.log('[Auth] Cleaning up auth state listener');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    console.log('[Auth] Login attempt for:', email);
    setLoading(true);
    
    try {
      const result = await loginUser(email, password);
      console.log('[Auth] Login result:', result);
      
      if (result.success && result.user) {
        console.log('[Auth] Setting user after successful login:', result.user);
        setUser(result.user);
        return { success: true, user: result.user };
      }
      
      return { success: false, message: result.message };
    } catch (error) {
      console.error('[Auth] Login error:', error);
      return { success: false, message: 'Erro inesperado durante o login' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; name: string; role: string }) => {
    setLoading(true);
    try {
      const result = await registerUser(data);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
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
