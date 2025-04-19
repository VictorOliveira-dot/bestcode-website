
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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password // Não modifica a senha
      });
      
      if (error) {
        console.error("Authentication error:", error.message);
        throw error;
      }
      
      if (data && data.user) {
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

  const register = async (email: string, password: string, userData: any): Promise<any> => {
    try {
      setIsLoading(true);
      
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
      
      if (error) throw error;
      
      if (data.user) {
        const newUserData = {
          id: data.user.id,
          email: data.user.email || email,
          name: userData.name || email.split('@')[0],
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
