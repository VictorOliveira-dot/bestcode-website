
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      setLoading(true);
      
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
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('Auth state change:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT' || !session) {
          // Clear user state immediately on logout
          setUser(null);
          setLoading(false);
        } else if (event === 'SIGNED_IN' && session?.user) {
          setLoading(true);
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
          } finally {
            if (isMounted) {
              setLoading(false);
            }
          }
        } else if (event === 'TOKEN_REFRESHED' && session?.user && !user) {
          // Only fetch user data if we don't have it
          setLoading(true);
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
          } finally {
            if (isMounted) {
              setLoading(false);
            }
          }
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
