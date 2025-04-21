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
    console.log(`Auth attempt for: ${trimmedEmail.substring(0, 3)}...@${trimmedEmail.split('@')[1] || ''}`);

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
      
      // More specific error messages
      if (error.message?.includes('Invalid login credentials')) {
        return { 
          success: false, 
          message: 'Email or password incorrect. Please check your credentials and try again.' 
        };
      }
      
      return { 
        success: false, 
        message: error.message || 'Invalid credentials. Please check your email and password.' 
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
    console.log('User metadata:', data.user.user_metadata);
    
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
      return { success: false, message: 'Todos os campos são obrigatórios.' };
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
      console.error('Erro no registro:', authError);
      return { success: false, message: authError.message };
    }

    if (!authData?.user) {
      console.error('Registro falhou: Nenhum usuário criado');
      return { success: false, message: 'Não foi possível criar a conta.' };
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
      console.error('Erro ao criar perfil de usuário:', userError);
      return { success: false, message: 'Erro ao criar perfil. Por favor, contate o suporte.' };
    }

    console.log('Usuário registrado com sucesso:', email);
    return { success: true, message: 'Conta criada com sucesso!' };
  } catch (error: any) {
    console.error('Erro no processo de registro:', error);
    return { success: false, message: error.message || 'Erro ao registrar' };
  }
};

export const logoutUser = async () => {
  console.log('Iniciando processo de logout');
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível realizar o logout. Por favor, tente novamente."
      });
      return { success: false };
    }
    
    console.log('Logout realizado com sucesso');
    return { success: true };
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    toast({
      variant: "destructive",
      title: "Erro ao sair",
      description: "Não foi possível realizar o logout. Por favor, tente novamente."
    });
    return { success: false };
  }
};
