
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Define user types
export interface User {
  id: string;
  name?: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar_url?: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData: any) => Promise<any>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user details from the users table
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user details:', error);
            setIsLoading(false);
            return;
          }

          if (userData) {
            const userInfo: User = {
              id: userData.id,
              name: userData.name || userData.email,
              email: userData.email,
              role: userData.role as 'student' | 'teacher' | 'admin',
              avatar_url: userData.avatar_url
            };

            setUser(userInfo);
            localStorage.setItem('bestcode_user', JSON.stringify(userInfo));
          }
        }
      } catch (error) {
        console.error("Error in authentication check:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        throw authError;
      }
      
      if (authData && authData.user) {
        // Fetch user details from the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();
        
        if (userError) {
          console.error('Usuário autenticado, mas não encontrado na tabela users:', userError);
          throw new Error('Usuário não encontrado no sistema');
        }
        
        // Usuário encontrado na tabela users
        const userInfo: User = {
          id: userData.id,
          name: userData.name || userData.email,
          email: userData.email,
          role: userData.role as 'student' | 'teacher' | 'admin',
          avatar_url: userData.avatar_url
        };
        
        setUser(userInfo);
        localStorage.setItem('bestcode_user', JSON.stringify(userInfo));
        
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo de volta, ${userInfo.name || userInfo.email}!`,
        });
        
        return userInfo;
      }
      
      return null;
    } catch (err: any) {
      console.error("Erro durante login:", err);
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: err.message || "Ocorreu um erro durante o login. Verifique suas credenciais.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, userData: any): Promise<any> => {
    try {
      setIsLoading(true);
      
      // Register with Supabase for normal users
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'student'
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create user record in the users table
        const newUserData = {
          id: data.user.id,
          email: data.user.email || email,
          name: userData.name || email.split('@')[0],
          role: userData.role || 'student',
          avatar_url: userData.avatar_url
        };
        
        const { error: profileError } = await supabase
          .from('users')
          .insert([newUserData]);
          
        if (profileError) {
          console.error("Erro ao inserir dados do usuário:", profileError);
          // Continue with the registration process
        }
        
        if (data.session) {
          const userInfo: User = {
            id: data.user.id,
            name: userData.name || email.split('@')[0],
            email: data.user.email || email,
            role: userData.role || 'student',
            avatar_url: userData.avatar_url
          };
          
          setUser(userInfo);
          localStorage.setItem('bestcode_user', JSON.stringify(userInfo));
          
          toast({
            title: "Conta criada com sucesso!",
            description: "Você foi autenticado automaticamente.",
          });
        } else {
          // Supabase may be configured to require email verification
          toast({
            title: "Conta criada com sucesso!",
            description: "Por favor, verifique seu email para confirmar o cadastro.",
          });
        }
        
        return data;
      }
      
      return null;
    } catch (err: any) {
      console.error("Erro durante registro:", err);
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: err.message || "Ocorreu um erro durante o registro.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      if (isLoading) return;
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear state and localStorage
      setUser(null);
      localStorage.removeItem('bestcode_user');
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro durante logout:", error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: error.message || "Ocorreu um erro durante o logout.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
