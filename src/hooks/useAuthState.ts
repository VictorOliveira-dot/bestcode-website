
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

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (session?.user) {
          // Use setTimeout to avoid potential deadlocks
          setTimeout(async () => {
            try {
              console.log("User authenticated in state change event:", session.user.email);
              
              // Fetch or create user data from public.users table - SEMPRE verifica no Supabase em tempo real
              const userData = await fetchUserData(session.user);
              
              if (userData) {
                console.log("Setting user state with role from DB:", userData.role);
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  name: userData.name,
                  role: userData.role as 'admin' | 'teacher' | 'student',
                });

                // Create user profile if it doesn't exist
                try {
                  // Check if profile record exists
                  const { data: profileData, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .maybeSingle();

                  if (profileError && profileError.code !== 'PGRST116') {
                    console.error("Error checking user profile:", profileError);
                  }

                  // If no profile exists, create one
                  if (!profileData) {
                    console.log("Creating initial profile record for user");
                    const { error: insertError } = await supabase
                      .from('user_profiles')
                      .upsert({
                        id: session.user.id,
                        is_profile_complete: false
                      });

                    if (insertError) {
                      console.error("Error creating initial profile:", insertError);
                    }
                  }
                } catch (profileError) {
                  console.error('Error handling user profile:', profileError);
                }
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

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log("Initial session check: User is logged in");
      } else {
        console.log("Initial session check: No active session");
        setLoading(false);
      }
    });

    // Clean up subscription
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
