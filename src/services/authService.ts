
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { AuthUser } from "@/hooks/useAuthState";

export const fetchUserData = async (authUser: User) => {
  try {
    // console.log("Fetching user data from public.users for:", authUser.email);
    
    // First, check if the user exists in the public.users table
    const { data: userData, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();  // Use maybeSingle instead of single to avoid the "multiple (or no) rows returned" error

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error fetching user data:', selectError);
      return null;
    }
    
    // If user is not found, create a new user record
    if (!userData) {
      // console.log("User not found in public.users table, creating record for:", authUser.email);
      
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
        // Use upsert instead of insert to avoid duplicate key errors
        const { data: newUser, error: upsertError } = await supabase
          .from('users')
          .upsert({
            id: authUser.id,
            email: authUser.email,
            name: metaName,
            role: metaRole,
            is_active: metaRole !== 'student' // Only students need to be activated through payment
          })
          .select()
          .single();
            
        if (upsertError) {
          console.error('Error creating user record:', upsertError);
          return null;
        }
        
        // console.log('Created/updated user record with role:', newUser.role);
        return newUser;
      } catch (error) {
        console.error('Error in user creation/update:', error);
        return null;
      }
    }

    // console.log("Found user data in public.users with role:", userData.role);
    return userData;
  } catch (error) {
    console.error('Error in fetchUserData:', error);
    return null;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    // console.log('Attempting login with:', email);
    
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
      // console.log('Login successful for:', data.user.email);
      
      // Fetch user data from database after successful login
      const userData = await fetchUserData(data.user);
      
      if (userData) {
        // Return the complete user data with the success message
        return { 
          success: true, 
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: userData.name,
            role: userData.role as 'admin' | 'teacher' | 'student',
            is_active: userData.is_active,
          }
        };
      }
      
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
    
    // Clear all possible auth data immediately
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('sb-jqnarznabyiyngcdqcff-auth-token');
    sessionStorage.clear();
    
    // Use global scope to ensure all sessions are terminated
    const { error } = await supabase.auth.signOut({
      scope: 'global'
    });
    
    if (error) {
      console.error('Erro durante logout:', error.message);
    }
    
    // Force immediate cleanup of any cached session data
    try {
      // Clear any cached session data from the client
      supabase.auth.admin?.deleteUser;
    } catch (e) {
      // Ignore cleanup errors
    }
    
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
    // First check if user already exists to avoid duplicate key errors
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', data.email)
      .maybeSingle();

    if (existingUser) {
      return {
        success: false,
        message: 'Este email já está em uso'
      };
    }

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
      message: 'Registration successful',
      user: authResponse.data.user
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'An error occurred during registration'
    };
  }
};
