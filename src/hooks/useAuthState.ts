
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
        } else if (event === 'SIGNED_IN' && session?.user) {
          console.log("User signed in, fetching user data with is_active status");
          const userData = await fetchUserData(session.user);
          if (userData) {
            console.log("User data fetched:", {
              id: userData.id,
              email: userData.email,
              role: userData.role,
              is_active: userData.is_active
            });
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role as 'admin' | 'teacher' | 'student',
              is_active: userData.is_active
            });
          }
          setLoading(false);
        }
      }
    );

    // Check initial session with timeout to prevent infinite loading
    const checkInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("Initial session check: No active session");
          setLoading(false);
        } else {
          console.log("Initial session check: Session exists, fetching user data with is_active status");
          const userData = await fetchUserData(session.user);
          if (userData) {
            console.log("Initial user data fetched:", {
              id: userData.id,
              email: userData.email,
              role: userData.role,
              is_active: userData.is_active
            });
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role as 'admin' | 'teacher' | 'student',
              is_active: userData.is_active
            });
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking initial session:", error);
        setLoading(false);
      }
    };

    // Set a timeout to ensure loading doesn't stay true indefinitely
    const loadingTimeout = setTimeout(() => {
      console.log("Auth loading timeout reached, setting loading to false");
      setLoading(false);
    }, 3000); // 3 second timeout

    checkInitialSession();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  return { user, loading, setUser };
};
