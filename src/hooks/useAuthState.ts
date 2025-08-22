
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { fetchUserData } from '@/services/authService';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  is_active?: boolean;
}

// Convert this hook to a function component to properly access React hooks
export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        // Check initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && isMounted) {
          const userData = await fetchUserData(session.user);
          if (userData && isMounted) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: userData.name,
              role: userData.role as 'admin' | 'teacher' | 'student',
              is_active: userData.is_active,
            });
          }
        } else if (isMounted) {
          // No session found - ensure user is cleared
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        
        console.log('Auth state change:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT' || !session) {
          // Clear user state immediately on logout and stop loading
          setUser(null);
          setLoading(false);
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Handle sign in - fetch user data asynchronously
          setTimeout(async () => {
            if (!isMounted) return;
            try {
              const userData = await fetchUserData(session.user);
              if (userData && isMounted) {
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  name: userData.name,
                  role: userData.role as 'admin' | 'teacher' | 'student',
                  is_active: userData.is_active,
                });
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
              if (isMounted) {
                setUser(null);
              }
            } finally {
              if (isMounted) {
                setLoading(false);
              }
            }
          }, 0);
        } else if (event === 'TOKEN_REFRESHED' && session?.user && !user) {
          // Handle token refresh - only if we don't have user data
          setTimeout(async () => {
            if (!isMounted) return;
            try {
              const userData = await fetchUserData(session.user);
              if (userData && isMounted) {
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  name: userData.name,
                  role: userData.role as 'admin' | 'teacher' | 'student',
                  is_active: userData.is_active,
                });
              }
            } catch (error) {
              console.error('Error fetching user data on token refresh:', error);
            }
          }, 0);
        } else if (event === 'INITIAL_SESSION') {
          // Handle initial session - this is called during initialization
          setLoading(false);
        }
      }
    );

    // Initialize auth state
    initializeAuth();

    // Cleanup function
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, setUser };
};
