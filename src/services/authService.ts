
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const fetchUserData = async (authUser: User) => {
  try {
    console.log("Fetching user data from public.users for:", authUser.email);
    
    // First, check if the user exists in the public.users table
    const { data: userData, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (selectError) {
      console.error('Error fetching user data:', selectError);
      
      // If user is not found, create a new user record
      if (selectError.code === 'PGRST116') {
        console.log("User not found in public.users table, creating record for:", authUser.email);
        
        // Extract metadata from auth user or use defaults
        const metaName = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User';
        
        // Determine role - first try metadata, then default to student
        let metaRole = authUser.user_metadata?.role || 'student';
        // Ensure role is one of the valid types
        if (!['admin', 'teacher', 'student'].includes(metaRole)) {
          metaRole = 'student';
        }
        
        // If email is admin@bestcode.com, set role to admin regardless of metadata
        if (authUser.email === 'admin@bestcode.com') {
          metaRole = 'admin';
        } else if (authUser.email === 'professor@bestcode.com') {
          metaRole = 'teacher';
        } else if (authUser.email === 'aluno@bestcode.com') {
          metaRole = 'student';
        }
        
        try {
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              id: authUser.id,
              email: authUser.email,
              name: metaName,
              role: metaRole,
              is_active: false // Default to inactive until payment is completed
            })
            .select()
            .single();
            
          if (insertError) {
            console.error('Error creating user record:', insertError);
            return null;
          }
          
          console.log('Created new user record with role:', newUser.role);
          return newUser;
        } catch (error) {
          console.error('Error in user creation:', error);
          return null;
        }
      }
      return null;
    }

    console.log("Found user data in public.users with role:", userData.role);
    return userData;
  } catch (error) {
    console.error('Error in fetchUserData:', error);
    return null;
  }
};

export const loginUser = async (email: string, password: string) => {
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

export const logoutUser = async () => {
  try {
    console.log('Iniciando processo de logout...');
    
    // Use global scope to ensure all sessions are terminated
    const { error } = await supabase.auth.signOut({
      scope: 'global' // Garante que todas as sessões sejam encerradas
    });
    
    if (error) {
      console.error('Erro durante logout:', error.message);
      throw error; // Throw error to be caught in the component
    }
    
    // Wait a moment to ensure all state is cleared
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('Logout realizado com sucesso');
    return { success: true };
  } catch (error) {
    console.error('Erro inesperado durante logout:', error);
    return { success: false };
  }
};

export const registerUser = async (data: { 
  email: string; 
  password: string; 
  name: string; 
  role: string; 
}) => {
  try {
    // Directly sign up the user with Supabase auth
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
