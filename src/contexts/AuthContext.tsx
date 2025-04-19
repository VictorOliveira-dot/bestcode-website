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
    console.log("AuthProvider initialized, checking for existing session...");
    
    const checkAuthState = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          return;
        }
        
        if (session?.user) {
          console.log("Found existing session for user:", session.user.id);
          
          // Fetch user details from the users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user details:', userError);
            return;
          }

          if (userData) {
            console.log("Retrieved user data:", userData.email, userData.role);
            
            const userInfo: User = {
              id: userData.id,
              name: userData.name || userData.email,
              email: userData.email,
              role: userData.role as 'student' | 'teacher' | 'admin',
              avatar_url: userData.avatar_url
            };

            setUser(userInfo);
            localStorage.setItem('bestcode_user', JSON.stringify(userInfo));
            console.log("Session restored successfully");
          }
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

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log("User signed in:", session.user.id);
        
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
            console.log("User data updated after sign in");
          }
        } catch (err) {
          console.error("Error handling sign in:", err);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setUser(null);
        localStorage.removeItem('bestcode_user');
      }
    });
    
    // Initial auth check
    checkAuthState();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function with special attention to credential handling
  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      
      console.log("Login attempt with email:", email);
      
      // Don't modify the email or password, use exactly as entered
      // Only trim whitespace from email to help prevent common mistakes
      const cleanEmail = email.trim();
      
      console.log(`Processing login for: "${cleanEmail}"`);
      
      // Log the attempt without exposing the password
      console.log(`Login attempt with email: "${cleanEmail}" (password provided: ${password ? "yes" : "no"})`);
      
      // Direct authentication attempt with user input
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password // Use password exactly as provided
      });
      
      if (error) {
        console.error("Authentication error:", error.message);
        throw error;
      }
      
      if (data && data.user) {
        console.log("Authentication successful, fetching user profile...");
        
        // Fetch user details from the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (userError) {
          console.error('User authenticated but not found in users table:', userError);
          throw new Error('User profile not found. Please contact support.');
        }
        
        // Create user object from profile data
        const userInfo: User = {
          id: userData.id,
          name: userData.name || userData.email,
          email: userData.email,
          role: userData.role as 'student' | 'teacher' | 'admin',
          avatar_url: userData.avatar_url
        };
        
        console.log("Login successful for:", userInfo.email, "with role:", userInfo.role);
        
        setUser(userInfo);
        localStorage.setItem('bestcode_user', JSON.stringify(userInfo));
        
        return userInfo;
      }
      
      throw new Error("Authentication succeeded but user data is missing");
    } catch (err: any) {
      console.error("Login error:", err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function - using the existing implementation
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

  // Logout function - using the existing implementation
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
