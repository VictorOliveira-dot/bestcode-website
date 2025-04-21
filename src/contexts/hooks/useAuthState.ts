
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
    console.log('[Auth State] Starting authentication check');
    let mounted = true;
    
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('[Auth State] Auth state change event detected:', event, newSession?.user?.id || 'No session');
      
      if (!mounted) return;
      
      // Synchronous updates only within the callback
      setSession(newSession);
      
      if (event === 'SIGNED_OUT' || !newSession) {
        console.log('[Auth State] User signed out or no session');
        setUser(null);
        setLoading(false);
        return;
      }
      
      if (newSession?.user) {
        // Defer Supabase calls with setTimeout to prevent deadlocks
        setTimeout(async () => {
          if (!mounted) return;
          
          try {
            console.log('[Auth State] Fetching user data after auth event');
            const userData = await fetchUserData(newSession.user.id);
            
            if (!mounted) return;
            
            if (userData) {
              console.log('[Auth State] User data updated:', userData);
              setUser(userData);
            } else {
              console.log('[Auth State] Using metadata as fallback for user data');
              const metadata = newSession.user.user_metadata || {};
              setUser({
                id: newSession.user.id,
                email: newSession.user.email || '',
                name: metadata.name || newSession.user.email?.split('@')[0] || 'User',
                role: metadata.role || 'student'
              });
            }
          } catch (error) {
            console.error('[Auth State] Error fetching user data:', error);
          } finally {
            if (mounted) {
              setLoading(false);
            }
          }
        }, 0);
      }
    });

    // Then check for existing session
    const initializeSession = async () => {
      try {
        console.log('[Auth State] Checking for existing session');
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[Auth State] Error getting session:', error);
        }
        
        if (!mounted) return;
        
        console.log('[Auth State] Initial session:', initialSession?.user?.id || 'No initial session');
        
        // Set session state synchronously
        setSession(initialSession);
        
        if (initialSession?.user) {
          // Defer the database query to prevent deadlocks
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              const userData = await fetchUserData(initialSession.user.id);
              
              if (!mounted) return;
              
              if (userData) {
                console.log('[Auth State] Initial user data:', userData);
                setUser(userData);
              } else {
                console.log('[Auth State] Using metadata as fallback for user data');
                const metadata = initialSession.user.user_metadata || {};
                setUser({
                  id: initialSession.user.id,
                  email: initialSession.user.email || '',
                  name: metadata.name || initialSession.user.email?.split('@')[0] || 'User',
                  role: metadata.role || 'student'
                });
              }
            } catch (error) {
              console.error('[Auth State] Error loading user data:', error);
            } finally {
              if (mounted) {
                setLoading(false);
              }
            }
          }, 0);
        } else {
          console.log('[Auth State] No initial session found');
          if (mounted) {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('[Auth State] Error checking session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeSession();

    return () => {
      console.log('[Auth State] Cleaning up authentication subscription');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading };
};
