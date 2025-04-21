
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types/auth';
import { toast } from '@/hooks/use-toast';

export const fetchUserData = async (userId: string): Promise<User | null> => {
  try {
    console.log('Buscando dados do usuário:', userId);
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }

    if (!data) {
      console.log('Nenhum dado de usuário encontrado');
      return null;
    }

    console.log('Dados do usuário encontrados:', data);
    return data as User;
  } catch (error) {
    console.error('Erro inesperado ao buscar dados do usuário:', error);
    return null;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  console.log('Iniciando processo de login para:', email);

  try {
    // Make sure email and password are trimmed
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    if (!trimmedEmail || !trimmedPassword) {
      return { 
        success: false, 
        message: 'Email e senha são obrigatórios.' 
      };
    }

    // Debug values before sending to Supabase
    console.log('Tentando autenticar com email (mascarado):', trimmedEmail.split('@')[0] + '@***');
    console.log('Comprimento da senha:', trimmedPassword.length);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword
    });

    if (error) {
      console.error('Erro de autenticação detalhado:', {
        message: error.message,
        status: error.status,
        name: error.name
      });
      
      // More specific error messages
      if (error.message?.includes('Invalid login credentials')) {
        return { 
          success: false, 
          message: 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.' 
        };
      }
      
      return { 
        success: false, 
        message: error.message || 'Credenciais inválidas. Verifique seu email e senha.' 
      };
    }

    if (!data?.user) {
      console.error('Login falhou: Nenhum usuário retornado');
      return { 
        success: false, 
        message: 'Falha ao autenticar. Por favor, tente novamente.' 
      };
    }

    console.log('Login bem-sucedido para:', data.user.email);
    console.log('Sessão válida:', !!data.session);
    return { success: true };

  } catch (error: any) {
    console.error('Erro inesperado durante login:', error);
    return { 
      success: false, 
      message: error.message || 'Ocorreu um erro ao fazer login' 
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
