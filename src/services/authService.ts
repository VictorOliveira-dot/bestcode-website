
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { AuthUser } from "@/hooks/useAuthState";

export const fetchUserData = async (authUser: User) => {
  try {
    
    // Buscar dados da tabela users e role da user_roles
    const { data: userData, error: selectError } = await supabase
      .from('users')
      .select(`
        id, 
        email, 
        name, 
        is_active,
        user_roles (role)
      `)
      .eq('id', authUser.id)
      .maybeSingle();

    if (selectError) {
      return null;
    }
    
    // Se o usuário foi encontrado, retornar os dados
    if (userData) {
      const role = (userData.user_roles as any)?.[0]?.role || 'student';
      return {
        ...userData,
        role
      };
    }
    
    // Se não encontrou, criar novo registro
    
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
      // Inserir usuário na tabela users (sem role)
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email,
          name: metaName,
          is_active: metaRole !== 'student'
        })
        .select('id, email, name, is_active')
        .single();
          
      if (insertError) {
        return null;
      }
      
      // Inserir role na tabela user_roles
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authUser.id,
          role: metaRole
        });
      
      if (roleError) {
        return null;
      }
      
      return {
        ...newUser,
        role: metaRole
      };
    } catch (error) {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    
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
