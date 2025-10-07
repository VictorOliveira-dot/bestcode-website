
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { AuthUser } from "@/hooks/useAuthState";

export const fetchUserData = async (authUser: User) => {
  try {
    console.log("Buscando dados do usuário para:", authUser.email);
    
    // Buscar dados da tabela users
    const { data: userData, error: selectError } = await supabase
      .from('users')
      .select('id, email, name, role, is_active')
      .eq('id', authUser.id)
      .maybeSingle();

    if (selectError) {
      console.error("Erro ao buscar dados do usuário:", selectError);
      return null;
    }
    
    // Se o usuário foi encontrado, retornar os dados
    if (userData) {
      console.log("Dados do usuário encontrados:", {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        is_active: userData.is_active
      });
      return userData;
    }
    
    // Se não encontrou, criar novo registro
    console.log("Usuário não encontrado na tabela users, criando registro...");
    
    const metaName = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário';
    let metaRole = authUser.user_metadata?.role || 'student';
    
    // Validar role
    if (!['admin', 'teacher', 'student'].includes(metaRole)) {
      metaRole = 'student';
    }
    
    // Tratamento especial para emails conhecidos
    if (authUser.email === 'admin@bestcode.com' || authUser.email === 'contato@bestcode.com.br') {
      metaRole = 'admin';
    } else if (authUser.email === 'professor@bestcode.com') {
      metaRole = 'teacher';
    } else if (authUser.email === 'aluno@bestcode.com' || authUser.email === 'adrianarvargas.av@gmail.com') {
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
          is_active: metaRole !== 'student'
        })
        .select('id, email, name, role, is_active')
        .single();
          
      if (insertError) {
        console.error("Erro ao criar usuário:", insertError);
        return null;
      }
      
      console.log('Registro de usuário criado com role:', newUser.role);
      return newUser;
    } catch (error) {
      console.error("Exceção ao criar usuário:", error);
      return null;
    }
  } catch (error) {
    console.error("Exceção em fetchUserData:", error);
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
      .from('user_profiles')
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
