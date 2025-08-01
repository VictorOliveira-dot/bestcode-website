
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
    setLoading(true);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Handle all auth state changes properly
        if (event === 'SIGNED_OUT' || !session) {
          // Clear user state immediately on logout
          setUser(null);
          setLoading(false);
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Only fetch user data on successful sign in
          const userData = await fetchUserData(session.user);
          if (userData) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: userData.name,
              role: userData.role as 'admin' | 'teacher' | 'student',
              is_active: userData.is_active,
            });
          }
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Keep existing user state on token refresh
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setUser(null);
        setLoading(false);
      } else {
        // Don't auto-login on initial load
        setLoading(false);
      }
    });

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, setUser };
};
