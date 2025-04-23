
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<{ success: boolean }>;
  register: (data: { email: string; password: string; name: string; role: string }) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => ({ success: false }),
  logout: async () => ({ success: false }),
  register: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user data from public.users table
  const fetchUserData = async (authUser: User) => {
    try {
      console.log("Fetching user data from public.users for:", authUser.email);
      
      // Query the public.users table for the user role
      const { data: userData, error: selectError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (selectError) {
        console.error('Error fetching user data:', selectError);
        return null;
      }

      if (userData) {
        console.log("Found user data in public.users:", userData);
        return userData;
      } else {
        console.log("User not found in public.users table, creating record for:", authUser.email);
        
        // Get user metadata from auth user
        const metaName = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User';
        const metaRole = authUser.user_metadata?.role || 'student';
        
        // Create a new user record
        try {
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              id: authUser.id,
              email: authUser.email,
              name: metaName,
              role: metaRole
            })
            .select()
            .single();
            
          if (insertError) {
            console.error('Error creating user record:', insertError);
            return null;
          }
          
          console.log('Created new user record:', newUser);
          return newUser;
        } catch (error) {
          console.error('Error in user creation:', error);
          return null;
        }
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      return null;
    }
  };

  // Initialization: Set up auth state listener and check current session
  useEffect(() => {
    console.log("Auth Provider: Initializing authentication...");
    setLoading(true);
    
    // First set up listener for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (session?.user) {
          // Important: Use setTimeout to avoid Supabase call deadlocks
          setTimeout(async () => {
            try {
              console.log("User authenticated in state change event:", session.user.email);
              
              // Fetch user data from public.users table
              const userData = await fetchUserData(session.user);
              
              if (userData) {
                console.log("Setting user state with role:", userData.role);
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  name: userData.name,
                  role: userData.role as 'admin' | 'teacher' | 'student',
                });
              } else {
                // Fallback to using metadata if we couldn't get user record
                console.log("Using auth metadata as fallback for user data");
                const metaName = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
                const metaRole = session.user.user_metadata?.role || 'student';
                
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  name: metaName,
                  role: metaRole as 'admin' | 'teacher' | 'student',
                });
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

    // Then check existing session
    const initializeAuth = async () => {
      try {
        console.log("Initializing authentication...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error fetching session:", sessionError);
          setLoading(false);
          return;
        }
        
        console.log("Session found:", session?.user?.email || "No session");
        
        if (session?.user) {
          console.log("User authenticated during initialization:", session.user.email);
          
          // Fetch user data from public.users table
          const userData = await fetchUserData(session.user);
          
          if (userData) {
            console.log("Setting user state during init with role:", userData.role);
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: userData.name,
              role: userData.role as 'admin' | 'teacher' | 'student',
            });
          } else {
            // Fallback to using metadata if we couldn't get user record
            console.log("Using auth metadata as fallback during init");
            const metaName = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
            const metaRole = session.user.user_metadata?.role || 'student';
            
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: metaName,
              role: metaRole as 'admin' | 'teacher' | 'student',
            });
          }
        } else {
          console.log("No session found during initialization");
          setUser(null);
        }
      } catch (error) {
        console.error('Error during authentication initialization:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Clean up subscription when unmounting
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        return {
          success: false,
          message: error.message
        };
      }

      if (data?.user) {
        console.log('Login successful for:', data.user.email);
        // The user state will be updated by the onAuthStateChange listener
        return { success: true };
      }

      return {
        success: false,
        message: 'Authentication failed. Please try again.'
      };
    } catch (error: any) {
      console.error('Unexpected error during login:', error.message);
      return {
        success: false,
        message: error.message || 'An error occurred during login'
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error during logout:', error.message);
        return { success: false };
      }
      
      // User data will be updated by onAuthStateChange
      return { success: true };
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      return { success: false };
    }
  };

  // Register function
  const register = async (data: { email: string; password: string; name: string; role: string }) => {
    try {
      // Register user in supabase auth
      const authResponse = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role
          }
        }
      });

      if (authResponse.error) {
        return {
          success: false,
          message: authResponse.error.message
        };
      }

      // The trigger in the database will automatically create a record
      // in the users table when a new user is created in auth.users

      return { 
        success: true,
        message: 'Registration successful'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An error occurred during registration'
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
