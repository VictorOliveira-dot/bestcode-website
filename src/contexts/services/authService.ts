
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types/auth';
import { toast } from '@/hooks/use-toast';

export const fetchUserData = async (userId: string): Promise<User | null> => {
  try {
    console.log('[Auth Service] Fetching user data for ID:', userId);
    
    // First try to fetch from public.users table
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('[Auth Service] Error fetching user data:', error);
      return null;
    }

    if (!data) {
      console.log('[Auth Service] No user data found in database');
      
      // If no user data in users table, fetch from auth metadata
      const { data: { user } } = await supabase.auth.getUser(userId);
      
      if (user) {
        console.log('[Auth Service] Using auth metadata for user data');
        const metadata = user.user_metadata || {};
        return {
          id: user.id,
          email: user.email || '',
          name: metadata.name || user.email?.split('@')[0] || 'User',
          role: metadata.role || 'student'
        };
      }
      
      return null;
    }

    console.log('[Auth Service] User data found:', data);
    return data as User;
  } catch (error) {
    console.error('[Auth Service] Unexpected error fetching user data:', error);
    return null;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  console.log('[Auth Service] Starting login process for:', email);

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

    console.log('[Auth Service] Attempting Supabase authentication...');
    
    // Log auth attempt (masking sensitive data)
    console.log(`[Auth Service] Auth attempt for: ${trimmedEmail}`);

    // Clear any previous sessions to avoid conflicts
    await supabase.auth.signOut();
    
    // Attempt to sign in with provided credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword
    });

    if (error) {
      console.error('[Auth Service] Authentication error details:', {
        message: error.message,
        status: error.status,
        name: error.name
      });
      
      return { 
        success: false, 
        message: 'Email or password incorrect. Please check your credentials and try again.' 
      };
    }

    if (!data?.user) {
      console.error('[Auth Service] Login failed: No user returned');
      return { 
        success: false, 
        message: 'Authentication failed. Please try again.' 
      };
    }

    console.log('[Auth Service] Login successful for user ID:', data.user.id);
    console.log('[Auth Service] Valid session:', !!data.session);
    
    return { success: true };

  } catch (error: any) {
    console.error('[Auth Service] Unexpected error during login:', error);
    return { 
      success: false, 
      message: error.message || 'An error occurred during login' 
    };
  }
};

export const logoutUser = async () => {
  console.log('[Auth Service] Starting logout process');
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('[Auth Service] Error during logout:', error);
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "Could not logout. Please try again."
      });
      return { success: false };
    }
    
    console.log('[Auth Service] Logout successful');
    return { success: true };
  } catch (error) {
    console.error('[Auth Service] Error during logout:', error);
    toast({
      variant: "destructive",
      title: "Error logging out",
      description: "Could not logout. Please try again."
    });
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
      console.error('[Auth Service] Registration error:', authError);
      return { success: false, message: authError.message };
    }

    if (!authData?.user) {
      console.error('[Auth Service] Registration failed: No user created');
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
      console.error('[Auth Service] Error creating user profile:', userError);
      return { success: false, message: 'Error creating profile. Please contact support.' };
    }

    console.log('[Auth Service] User registered successfully:', email);
    return { success: true, message: 'Account created successfully!' };
  } catch (error: any) {
    console.error('[Auth Service] Error during registration process:', error);
    return { success: false, message: error.message || 'Error registering' };
  }
};
