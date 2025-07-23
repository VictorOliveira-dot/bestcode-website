
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
    console.log("Auth Provider: Initializing authentication...");
    setLoading(true);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing state");
          setUser(null);
          setLoading(false);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            console.log("Session active, fetching user data");
            try {
              const userData = await fetchUserData(session.user);
              if (userData) {
                setUser(userData);
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
              setUser(null);
            }
          }
          setLoading(false);
        } else if (event === 'INITIAL_SESSION' && session) {
          console.log("Initial session found, fetching user data");
          try {
            const userData = await fetchUserData(session.user);
            if (userData) {
              setUser(userData);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            setUser(null);
          }
          setLoading(false);
        }
      }
    );

    // Check initial session and set user if exists
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        console.log("Initial session check: No active session");
        setLoading(false);
      } else {
        console.log("Initial session check: Session exists, fetching user data");
        try {
          const userData = await fetchUserData(session.user);
          if (userData) {
            setUser(userData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
        setLoading(false);
      }
    });

    // Clean up subscription
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, setUser };
};
