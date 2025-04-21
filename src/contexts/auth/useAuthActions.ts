
import { useState } from 'react';
import { User } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useAuthActions(setUser: (user: User | null) => void) {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      
      console.log("Login attempt with email:", email);
      
      // Standardize email format
      const cleanEmail = email.trim().toLowerCase();
      
      if (!cleanEmail || !password) {
        throw new Error("Email and password are required");
      }
      
      // Clear any previous session state
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.warn("Error clearing previous session:", signOutError);
      }
      
      // Try authentication with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error("Authentication error:", error);
        throw error;
      }
      
      if (!data || !data.user) {
        throw new Error("Authentication succeeded but user data not returned");
      }
      
      console.log("Authentication successful, fetching user profile...");
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (userError) {
        console.error('User authenticated but not found in users table:', userError);
        throw new Error('User profile not found. Please contact support.');
      }
      
      if (!userData) {
        throw new Error("User authenticated but profile data is empty");
      }
      
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
    } catch (err: any) {
      console.error("Login error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: any): Promise<any> => {
    try {
      setIsLoading(true);
      
      const cleanEmail = email.trim().toLowerCase();
      
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'student'
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        const newUserData = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          name: userData.name || cleanEmail.split('@')[0],
          role: userData.role || 'student',
          avatar_url: userData.avatar_url
        };
        
        const { error: profileError } = await supabase
          .from('users')
          .insert([newUserData]);
          
        if (profileError) throw profileError;
        
        if (data.session) {
          const userInfo: User = newUserData;
          setUser(userInfo);
          localStorage.setItem('bestcode_user', JSON.stringify(userInfo));
          
          toast({
            title: "Account created successfully!",
            description: "You have been automatically logged in.",
          });
        } else {
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

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      localStorage.removeItem('bestcode_user');
      
      toast({
        title: "Logout successful",
        description: "You have been successfully logged out.",
      });
      
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

  return { login, register, logout, isLoading };
}
