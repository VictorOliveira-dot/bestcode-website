
import { useState, useEffect } from 'react';
import { User } from './types';
import { supabase } from '@/integrations/supabase/client';

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider initialized, checking for existing session...");
    
    const checkAuthState = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          return;
        }
        
        if (session?.user) {
          console.log("Found existing session for user:", session.user.id);
          await fetchAndSetUser(session.user.id);
        } else {
          console.log("No active session found");
          localStorage.removeItem('bestcode_user');
        }
      } catch (error) {
        console.error("Authentication check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAndSetUser = async (userId: string) => {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Error fetching user details:', userError);
        return;
      }

      if (userData) {
        const userInfo: User = {
          id: userData.id,
          name: userData.name || userData.email,
          email: userData.email,
          role: userData.role as 'student' | 'teacher' | 'admin',
          avatar_url: userData.avatar_url
        };
        setUser(userInfo);
        localStorage.setItem('bestcode_user', JSON.stringify(userInfo));
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log("User signed in:", session.user.id);
        await fetchAndSetUser(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setUser(null);
        localStorage.removeItem('bestcode_user');
      }
    });
    
    checkAuthState();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, setUser, isLoading, setIsLoading };
}
