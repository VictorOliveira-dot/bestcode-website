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
    console.log("Auth Provider: Initializing authentication...");
    setLoading(true);
    
    // Primeiro configurar o listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (session?.user) {
          try {
            console.log("User authenticated in state change event:", session.user.email);
            // Busca dados adicionais do usuário da tabela public.users
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('name, role')
              .eq('id', session.user.id)
              .single();
            
            if (userError) {
              console.error('Error fetching user data:', userError);
              setUser(null);
            } else if (userData) {
              console.log("User data found in state change:", userData);
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: userData.name,
                role: userData.role as 'admin' | 'teacher' | 'student',
              });
            } else {
              console.error('User authenticated, but not found in users table');
              setUser(null);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
          }
        } else {
          console.log("No session detected in state change");
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Depois verificar a sessão existente
    const initializeAuth = async () => {
      try {
        console.log("Initializing authentication...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error fetching session:", sessionError);
          setLoading(false);
          return;
        }
        
        console.log("Session found:", session?.user?.email || "No session");
        
        if (session?.user) {
          console.log("User authenticated during initialization:", session.user.email);
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('name, role')
            .eq('id', session.user.id)
            .single();
          
          if (userError) {
            console.error("Error fetching user data:", userError);
            setUser(null);
          } else if (userData) {
            console.log("User data found during initialization:", userData);
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: userData.name,
              role: userData.role as 'admin' | 'teacher' | 'student',
            });
          } else {
            console.error('User authenticated, but not found in users table');
            setUser(null);
          }
        } else {
          console.log("No session found during initialization");
          setUser(null);
        }
      } catch (error) {
        console.error('Error during authentication initialization:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Limpar a inscrição ao desmontar
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
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

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error ao fazer logout:', error.message);
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
