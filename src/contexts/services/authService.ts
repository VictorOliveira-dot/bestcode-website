
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types/auth';
import { toast } from '@/hooks/use-toast';

export const fetchUserData = async (userId: string): Promise<User | null> => {
  try {
    console.log('Fetching user data for ID:', userId);
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user data:', error);
      return null;
    }

    if (!data) {
      console.log('No user data found in database');
      return null;
    }

    console.log('User data found:', data);
    return data as User;
  } catch (error) {
    console.error('Unexpected error fetching user data:', error);
    return null;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  console.log('Starting login process for:', email);

  try {
    // Make sure email and password are trimmed
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    if (!trimmedEmail || !trimmedPassword) {
      return { 
        success: false, 
        message: 'Email and password are required.' 
      };
    }

    console.log('Attempting Supabase authentication...');
    
    // Log auth attempt (masking sensitive data)
    console.log(`Auth attempt for: ${trimmedEmail}`);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword
    });

    if (error) {
      console.error('Authentication error details:', {
        message: error.message,
        status: error.status,
        name: error.name
      });
      
      if (error.message) {
        return { 
          success: false, 
          message: 'Email or password incorrect. Please check your credentials and try again.' 
        };
      }
      
      return { 
        success: false, 
        message: 'Invalid credentials. Please check your email and password.' 
      };
    }

    if (!data?.user) {
      console.error('Login failed: No user returned');
      return { 
        success: false, 
        message: 'Authentication failed. Please try again.' 
      };
    }

    console.log('Login successful for user ID:', data.user.id);
    console.log('Valid session:', !!data.session);
    
    return { success: true };

  } catch (error: any) {
    console.error('Unexpected error during login:', error);
    return { 
      success: false, 
      message: error.message || 'An error occurred during login' 
    };
  }
};

export const registerUser = async (data: { 
  email: string; 
  password: string; 
  name: string; 
  role: string; 
}) => {
  try {
    // Trim inputs
    const email = data.email.trim();
    const password = data.password.trim();
    const name = data.name.trim();
    
    if (!email || !password || !name) {
      return { success: false, message: 'All fields are required.' };
    }
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: data.role
        }
      }
    });

    if (authError) {
      console.error('Registration error:', authError);
      return { success: false, message: authError.message };
    }

    if (!authData?.user) {
      console.error('Registration failed: No user created');
      return { success: false, message: 'Could not create account.' };
    }

    const { error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email,
          name,
          role: data.role
        }
      ]);

    if (userError) {
      console.error('Error creating user profile:', userError);
      return { success: false, message: 'Error creating profile. Please contact support.' };
    }

    console.log('User registered successfully:', email);
    return { success: true, message: 'Account created successfully!' };
  } catch (error: any) {
    console.error('Error during registration process:', error);
    return { success: false, message: error.message || 'Error registering' };
  }
};

export const logoutUser = async () => {
  console.log('Starting logout process');
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error during logout:', error);
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "Could not logout. Please try again."
      });
      return { success: false };
    }
    
    console.log('Logout successful');
    return { success: true };
  } catch (error) {
    console.error('Error during logout:', error);
    toast({
      variant: "destructive",
      title: "Error logging out",
      description: "Could not logout. Please try again."
    });
    return { success: false };
  }
};
