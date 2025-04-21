import { useSupabaseBase } from './useSupabaseBase';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseAuth = () => {
  const { loading, error, setLoading, setError } = useSupabaseBase();

  // Function for authentication by email and password
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const cleanEmail = email.trim().toLowerCase();
      console.log(`Authentication attempt with: ${cleanEmail}`);
      
      if (!cleanEmail || !password) {
        throw new Error("Email and password are required");
      }
      
      // Clear any previous auth state to prevent conflicts
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.warn("Error clearing previous session:", signOutError);
      }
      
      // Try authentication with explicit options
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
        // Removed redirectTo option as it's causing TypeScript error
      });
      
      if (error) {
        console.error("Authentication error in useSupabaseAuth:", error);
        throw error;
      }
      
      if (!data || !data.user) {
        throw new Error("Authentication succeeded but user data not returned");
      }
      
      console.log("Login successful in useSupabaseAuth:", data);
      return data;
    } catch (err: any) {
      console.error("Login error in useSupabaseAuth:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function for user registration
  const register = async (email: string, password: string, userData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const cleanEmail = email.trim().toLowerCase(); // Consistência em email
      
      // First register the user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'student'
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Then insert additional data in the users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            { 
              id: authData.user.id,
              email: cleanEmail,
              name: userData.name,
              role: userData.role || 'student',
              avatar_url: userData.avatar_url
            }
          ]);
          
        if (profileError) throw profileError;
      }
      
      return authData;
    } catch (err: any) {
      console.error("Registration error:", err.message);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to retrieve logged-in user information
  const getCurrentUser = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        console.log("No active session found in getCurrentUser");
        return null;
      }
      
      console.log("Session found in getCurrentUser:", sessionData.session.user.id);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .single();
        
      if (error) {
        console.error("Error fetching user data:", error);
        throw error;
      }
      
      if (!data) {
        console.log("No user data found for ID:", sessionData.session.user.id);
        return null;
      }
      
      console.log("User data retrieved successfully:", data);
      return data;
    } catch (err: any) {
      console.error('Error fetching user:', err.message);
      return null;
    }
  };

  // Function for logout
  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error("Logout error:", err.message);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    getCurrentUser,
    loading,
    error
  };
};
