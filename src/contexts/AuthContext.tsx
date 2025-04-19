
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Define user types
export interface User {
  id: string;
  name?: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar_url?: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData: any) => Promise<any>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for session on initial load
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        setIsLoading(true);
        console.log("Checking authentication state...");
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("Session found, fetching user data from the database...");
          
          // Fetch user details from the users table
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user details:', error);
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

            console.log("User data retrieved successfully:", userInfo.email, userInfo.role);
            setUser(userInfo);
            
            // Store user info for quick access
            localStorage.setItem('bestcode_user', JSON.stringify(userInfo));
          } else {
            console.log("No user data found in database for session user");
          }
        } else {
          console.log("No session found");
          // Try to restore from localStorage if available
          const savedUser = localStorage.getItem('bestcode_user');
          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser);
              // Validate the session before using the saved user
              const { data } = await supabase.auth.getUser();
              if (data?.user && data.user.id === parsedUser.id) {
                console.log("Restored user from localStorage:", parsedUser.email);
                setUser(parsedUser);
              } else {
                console.log("Stored user session is invalid, clearing...");
                localStorage.removeItem('bestcode_user');
              }
            } catch (e) {
              console.error("Error parsing saved user:", e);
              localStorage.removeItem('bestcode_user');
            }
          }
        }
      } catch (error) {
        console.error("Error in authentication check:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Fetch user details from the users table
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user details on auth change:', error);
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
        } catch (err) {
          console.error("Error handling sign in:", err);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('bestcode_user');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function - fixed to correctly handle credentials
  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      
      console.log("Attempting login with email:", email);
      
      // Clean the email but DO NOT modify the password
      const cleanEmail = email.trim();
      
      // Log credentials for debugging (without showing the actual password)
      console.log(`Login attempt with email: "${cleanEmail}" and password length: ${password.length}`);
      
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password // Keep password exactly as entered
      });
      
      if (error) {
        console.error("Login error:", error.message);
        throw error;
      }
      
      if (data && data.user) {
        console.log("Login successful, fetching user profile...");
        
        // Fetch user details from the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (userError) {
          console.error('User authenticated, but not found in users table:', userError);
          throw new Error('User not found in the system');
        }
        
        // Found user in the users table
        const userInfo: User = {
          id: userData.id,
          name: userData.name || userData.email,
          email: userData.email,
          role: userData.role as 'student' | 'teacher' | 'admin',
          avatar_url: userData.avatar_url
        };
        
        console.log("User profile retrieved:", userInfo.email, userInfo.role);
        
        setUser(userInfo);
        localStorage.setItem('bestcode_user', JSON.stringify(userInfo));
        
        return userInfo;
      }
      
      return null;
    } catch (err: any) {
      console.error("Error during login:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, userData: any): Promise<any> => {
    try {
      setIsLoading(true);
      
      console.log("Attempting to register new user:", email);
      
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'student'
          }
        }
      });
      
      if (error) {
        console.error("Registration error:", error);
        throw error;
      }
      
      if (data.user) {
        // Create user record in the users table
        const newUserData = {
          id: data.user.id,
          email: data.user.email || email,
          name: userData.name || email.split('@')[0],
          role: userData.role || 'student',
          avatar_url: userData.avatar_url
        };
        
        console.log("Creating user profile in database:", newUserData.email);
        
        const { error: profileError } = await supabase
          .from('users')
          .insert([newUserData]);
          
        if (profileError) {
          console.error("Error inserting user data:", profileError);
          // Continue with the registration process despite this error
        }
        
        if (data.session) {
          // User is automatically signed in
          const userInfo: User = {
            id: data.user.id,
            name: userData.name || email.split('@')[0],
            email: data.user.email || email,
            role: userData.role || 'student',
            avatar_url: userData.avatar_url
          };
          
          setUser(userInfo);
          localStorage.setItem('bestcode_user', JSON.stringify(userInfo));
          
          toast({
            title: "Account created successfully!",
            description: "You have been automatically logged in.",
          });
        } else {
          // Supabase may be configured to require email verification
          toast({
            title: "Account created successfully!",
            description: "Please check your email to confirm your registration.",
          });
        }
        
        return data;
      }
      
      return null;
    } catch (err: any) {
      console.error("Error during registration:", err);
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: err.message || "An error occurred during registration.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      console.log("Attempting to log out");
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        throw error;
      }
      
      // Clear state and localStorage
      setUser(null);
      localStorage.removeItem('bestcode_user');
      
      toast({
        title: "Logout successful",
        description: "You have been successfully logged out.",
      });
      
      console.log("User logged out successfully");
    } catch (error: any) {
      console.error("Error during logout:", error);
      toast({
        variant: "destructive",
        title: "Error during logout",
        description: error.message || "An error occurred during logout.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
