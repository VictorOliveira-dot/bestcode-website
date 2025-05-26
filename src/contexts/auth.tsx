
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { loginUser, logoutUser, fetchUserData, registerUser } from '@/services/authService';
import { AuthUser } from './types/auth';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
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

    const initializeAuth = async () => {
      try {
        // Get initial session
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

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Supabase Auth] Event:', event, 'Session:', session ? 'present' : 'null');
        
        if (!mounted) return;

        setSession(session);
        
        if (session?.user && event !== 'TOKEN_REFRESHED') {
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
              setUser(authUser);
            }
          } catch (error) {
            console.error('[Auth] Error fetching user data:', error);
          }
        } else if (!session) {
          console.log('[Auth] No session, clearing user');
          setUser(null);
        }
      }
    );

    // Initialize auth state
    initializeAuth();

    return () => {
      console.log('[Auth] Cleaning up auth state listener');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await loginUser(email, password);
      return result;
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
