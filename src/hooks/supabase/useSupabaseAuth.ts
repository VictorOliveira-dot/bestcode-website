
import { useSupabaseBase } from './useSupabaseBase';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseAuth = () => {
  const { loading, error, setLoading, setError } = useSupabaseBase();

  // Function for authentication by email and password
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const cleanEmail = email.trim().toLowerCase(); // Garante email em minúsculas
      console.log(`Attempting login via hook with email: ${cleanEmail}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password // Use password exactly as provided
      });
      
      if (error) {
        console.error("Error in useSupabaseAuth:", error.message);
        throw error;
      }
      
      console.log("Login successful via hook:", data);
      return data;
    } catch (err: any) {
      console.error("Login error in hook:", err.message);
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
      
      if (!sessionData.session) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .single();
        
      if (error) throw error;
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
