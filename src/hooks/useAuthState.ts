
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

  // Function to check and update user activation status
  const checkUserActivation = async (currentUser: AuthUser) => {
    if (currentUser.role !== 'student' || currentUser.is_active) {
      return currentUser;
    }

    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('is_active')
        .eq('id', currentUser.id)
        .single();

      if (!error && userData?.is_active) {
        console.log("User activation status updated");
        const updatedUser = { ...currentUser, is_active: true };
        setUser(updatedUser);
        return updatedUser;
      }
    } catch (error) {
      console.error("Error checking user activation:", error);
    }

    return currentUser;
  };

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
          console.log("User signed in, fetching user data");
          const userData = await fetchUserData(session.user);
          if (userData) {
            const authUser: AuthUser = {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role as 'admin' | 'teacher' | 'student',
              is_active: userData.is_active,
            };
            setUser(authUser);
          }
          setLoading(false);
        }
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        console.log("Initial session check: No active session");
        setLoading(false);
      } else {
        console.log("Initial session check: Session exists, but not auto-logging in");
        setLoading(false);
      }
    });

    // Set up periodic check for student activation (every 30 seconds)
    let activationCheckInterval: NodeJS.Timeout;
    
    const startActivationCheck = () => {
      activationCheckInterval = setInterval(async () => {
        if (user && user.role === 'student' && !user.is_active) {
          console.log("Checking user activation status...");
          await checkUserActivation(user);
        }
      }, 30000); // Check every 30 seconds
    };

    // Start checking when we have a student user who is not active
    if (user && user.role === 'student' && !user.is_active) {
      startActivationCheck();
    }

    // Clean up subscription and interval
    return () => {
      console.log("Cleaning up auth subscription and intervals");
      subscription.unsubscribe();
      if (activationCheckInterval) {
        clearInterval(activationCheckInterval);
      }
    };
  }, [user]);

  return { user, loading, setUser };
};
