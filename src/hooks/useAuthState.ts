
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { fetchUserData } from '@/services/authService';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
}

// Convert this hook to a function component to properly access React hooks
export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Auth Provider: Initializing authentication...");
    setLoading(true);

    // Clear any existing session on initial load
    const clearSession = async () => {
      try {
        await supabase.auth.signOut();
        console.log("Previous session cleared");
      } catch (error) {
        console.error("Error clearing session:", error);
      }
    };

    // Clear session right away
    clearSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (session?.user) {
          // Use setTimeout to avoid potential deadlocks
          setTimeout(async () => {
            try {
              console.log("User authenticated in state change event:", session.user.email);
              
              // Fetch or create user data from public.users table
              const userData = await fetchUserData(session.user);
              
              if (userData) {
                console.log("Setting user state with role from DB:", userData.role);
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  name: userData.name,
                  role: userData.role as 'admin' | 'teacher' | 'student',
                });
              } else {
                console.error("Could not get or create user data in database");
                setUser(null);
              }
            } catch (error) {
              console.error('Error processing authenticated user:', error);
              setUser(null);
            } finally {
              setLoading(false);
            }
          }, 0);
        } else {
          console.log("No session detected in state change");
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Clean up subscription
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
