
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

    // Check for existing session
    const initializeAuth = async () => {
      try {
        console.log("Initializing authentication...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error fetching session:", sessionError);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          // User is logged in, fetch their data from the public.users table
          const { data: dbUser, error: dbError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (dbError) {
            console.error("Error fetching user from DB:", dbError);
            setUser(null);
          } else {
            console.log("Found user in DB with role:", dbUser.role);
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: dbUser.name,
              role: dbUser.role
            });
          }
        }
      } catch (error) {
        console.error('Error during authentication initialization:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Clean up subscription
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
