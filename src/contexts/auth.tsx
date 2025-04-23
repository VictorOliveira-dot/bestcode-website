
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<{ success: boolean }>;
  register: (data: { email: string; password: string; name: string; role: string }) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => ({ success: false }),
  logout: async () => ({ success: false }),
  register: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicialização: busca o estado atual da sessão e configura o listener de mudança de estado
  useEffect(() => {
    // Primeiro configurar o listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        // Apenas atualizações síncronas aqui
        setLoading(true);
        
        if (session?.user) {
          try {
            // Busca dados adicionais do usuário da tabela public.users
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('name, role')
              .eq('id', session.user.id)
              .single();
            
            if (userError) {
              console.error('Erro ao buscar dados do usuário:', userError);
              setUser(null);
            } else if (userData) {
              console.log("Dados do usuário encontrados:", userData);
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: userData.name,
                role: userData.role as 'admin' | 'teacher' | 'student',
              });
            } else {
              console.error('Usuário autenticado, mas não encontrado na tabela users');
              setUser(null);
            }
          } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Depois verificar a sessão existente
    const initializeAuth = async () => {
      try {
        console.log("Inicializando autenticação...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erro ao buscar sessão:", sessionError);
          return;
        }
        
        console.log("Sessão encontrada:", session?.user?.email);
        
        if (session?.user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('name, role')
            .eq('id', session.user.id)
            .single();
          
          if (userError) {
            console.error("Erro ao buscar dados do usuário:", userError);
          } else if (userData) {
            console.log("Dados do usuário encontrados:", userData);
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: userData.name,
              role: userData.role as 'admin' | 'teacher' | 'student',
            });
          } else {
            console.error('Usuário autenticado, mas não encontrado na tabela users');
          }
        } else {
          console.log("Nenhuma sessão encontrada");
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Limpar a inscrição ao desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Tentando login com:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erro de login:', error.message);
        return {
          success: false,
          message: error.message
        };
      }

      if (data?.user) {
        console.log('Login bem sucedido para:', data.user.email);
        // Os dados do usuário serão atualizados pelo onAuthStateChange
        return { success: true };
      }

      return {
        success: false,
        message: 'Falha na autenticação. Tente novamente.'
      };
    } catch (error: any) {
      console.error('Erro inesperado durante login:', error.message);
      return {
        success: false,
        message: error.message || 'Um erro ocorreu durante o login'
      };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro ao fazer logout:', error.message);
        return { success: false };
      }
      
      // Os dados do usuário serão atualizados pelo onAuthStateChange
      return { success: true };
    } catch (error) {
      console.error('Erro inesperado durante logout:', error);
      return { success: false };
    }
  };

  const register = async (data: { email: string; password: string; name: string; role: string }) => {
    try {
      // Registra o usuário no supabase auth
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

      // O trigger no banco de dados criará automaticamente um registro 
      // na tabela users quando um novo usuário for criado na auth.users

      return { 
        success: true,
        message: 'Registro realizado com sucesso'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Um erro ocorreu durante o registro'
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
