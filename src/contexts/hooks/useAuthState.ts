
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthState, User } from '../types/auth';
import { fetchUserData } from '../services/authService';

export const useAuthState = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('Starting authentication check');
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state change event detected:', event, newSession?.user?.id || 'No session');
      
      // Synchronous updates only within the callback
      setSession(newSession);
      
      if (newSession?.user) {
        // Defer Supabase calls with setTimeout to prevent deadlocks
        setTimeout(async () => {
          try {
            console.log('Fetching user data after auth event');
            const userData = await fetchUserData(newSession.user.id);
            
            if (userData) {
              console.log('User data updated:', userData);
              setUser(userData);
            } else {
              console.log('Using metadata as fallback for user data');
              const metadata = newSession.user.user_metadata || {};
              setUser({
                id: newSession.user.id,
                email: newSession.user.email || '',
                name: metadata.name || newSession.user.email?.split('@')[0] || 'User',
                role: metadata.role || 'student'
              });
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          } finally {
            setLoading(false);
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        setLoading(false);
      }
    });

    // Then check for existing session
    const initializeSession = async () => {
      try {
        console.log('Checking for existing session');
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        console.log('Initial session:', initialSession?.user?.id || 'No initial session');
        
        // Set session state synchronously
        setSession(initialSession);
        
        if (initialSession?.user) {
          // Defer the database query
          setTimeout(async () => {
            try {
              const userData = await fetchUserData(initialSession.user.id);
              
              if (userData) {
                console.log('Initial user data:', userData);
                setUser(userData);
              } else {
                console.log('Using metadata as fallback for user data');
                const metadata = initialSession.user.user_metadata || {};
                setUser({
                  id: initialSession.user.id,
                  email: initialSession.user.email || '',
                  name: metadata.name || initialSession.user.email?.split('@')[0] || 'User',
                  role: metadata.role || 'student'
                });
              }
            } catch (error) {
              console.error('Error loading user data:', error);
            } finally {
              setLoading(false);
            }
          }, 0);
        } else {
          console.log('No initial session found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setLoading(false);
      }
    };

    initializeSession();

    return () => {
      console.log('Cleaning up authentication subscription');
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading };
};
