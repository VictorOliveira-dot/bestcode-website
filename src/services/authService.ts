
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const fetchUserData = async (authUser: User) => {
  try {
    console.log("Fetching user data from public.users for:", authUser.email);
    
    const { data: userData, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (selectError) {
      console.error('Error fetching user data:', selectError);
      
      if (selectError.code === 'PGRST116') {
        console.log("User not found in public.users table, creating record for:", authUser.email);
        
        const metaName = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User';
        const metaRole = 'student';
        
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
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error during logout:', error.message);
      return { success: false };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Unexpected error during logout:', error);
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
