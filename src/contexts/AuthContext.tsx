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

// Test users para compatibilidade com implementação anterior
const TEST_USERS = {
  teacher: {
    id: '1',
    name: 'Professor Silva',
    email: 'professor@bestcode.com',
    password: 'teacher123',
    role: 'teacher' as const
  },
  student: {
    id: '2',
    name: 'Maria Aluna',
    email: 'aluno@bestcode.com',
    password: 'student123',
    role: 'student' as const
  },
  admin: {
    id: '3',
    name: 'Admin Sistema',
    email: 'admin@bestcode.com',
    password: 'admin123',
    role: 'admin' as const
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(true);

  useEffect(() => {
    console.log("AuthProvider initial mount - Checking authentication state");
    
    // First, check if there's a stored user in localStorage
    const storedUser = localStorage.getItem('bestcode_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Found stored user:", parsedUser);
        setUser(parsedUser);
        setIsLoading(false);
        return;
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem('bestcode_user');
      }
    }

    // If no stored user, check Supabase session
    const checkAuthState = async () => {
      try {
        console.log("Checking Supabase session...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("Active Supabase session found:", session.user);
          
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

            console.log("User details retrieved:", userInfo);
            setUser(userInfo);
            localStorage.setItem('bestcode_user', JSON.stringify(userInfo));
          }
        } else {
          console.log("No active Supabase session found");
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
    setIsLoading(true);
    
    try {
      // Verificar usuários de teste primeiro - sempre tenta os test users primeiro!
      let testUserFound = null;
      
      if (email === TEST_USERS.teacher.email && password === TEST_USERS.teacher.password) {
        testUserFound = TEST_USERS.teacher;
      } else if (email === TEST_USERS.student.email && password === TEST_USERS.student.password) {
        testUserFound = TEST_USERS.student;
      } else if (email === TEST_USERS.admin.email && password === TEST_USERS.admin.password) {
        testUserFound = TEST_USERS.admin;
      }
      
      if (testUserFound) {
        const { password: _, ...userWithoutPassword } = testUserFound;
        
        // Armazena o usuário no localStorage
        localStorage.setItem('bestcode_user', JSON.stringify(userWithoutPassword));
        
        // Atualiza o estado após o armazenamento
        setUser(userWithoutPassword);
        
        toast({
          title: "Login com usuário de teste",
          description: `Bem-vindo ${userWithoutPassword.name || email}!`,
          variant: "default",
        });
        
        setIsLoading(false);
        return userWithoutPassword;
      }
      
      // Se não for usuário de teste, tentar com Supabase
      if (!isSupabaseAvailable) {
        throw new Error('Serviço de autenticação não disponível');
      }
      
      // Tentar login com Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        throw authError;
      }
      
      if (authData && authData.user) {
        // Buscar dados completos do usuário na tabela users
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
    setIsLoading(true);
    
    try {
      // Verificar se está tentando registrar um dos usuários de teste
      if (email === TEST_USERS.teacher.email || email === TEST_USERS.student.email || email === TEST_USERS.admin.email) {
        // Já são contas de teste pré-configuradas, vamos fingir que foram criadas com sucesso
        const testRole = 
          email === TEST_USERS.teacher.email ? "teacher" :
          email === TEST_USERS.admin.email ? "admin" : "student";
          
        const testId = 
          email === TEST_USERS.teacher.email ? "1" :
          email === TEST_USERS.admin.email ? "3" : "2";
          
        const testUser = {
          id: testId,
          name: userData.name || email.split('@')[0],
          email: email,
          role: testRole as 'student' | 'teacher' | 'admin'
        };
        
        setUser(testUser);
        localStorage.setItem('bestcode_user', JSON.stringify(testUser));
        
        return { user: testUser };
      }
      
      // Se não for usuário de teste e o Supabase não estiver disponível
      if (!isSupabaseAvailable) {
        throw new Error('Serviço de registro não disponível');
      }
      
      // Registrar com Supabase para usuários normais
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
        // Criar registro de usuário na tabela users
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
          // Tente mesmo assim continuar com o processo de registro
        }
        
        // Se auto-login após o registro for necessário, usar os mesmos passos do método login
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
          // Supabase pode configurado para exigir verificação de email
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
      
      // Verificar se o usuário atual é um usuário de teste (localStorage)
      const storedUser = localStorage.getItem('bestcode_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && 
             (parsedUser.email === TEST_USERS.teacher.email || 
              parsedUser.email === TEST_USERS.student.email || 
              parsedUser.email === TEST_USERS.admin.email)) {
            // É um usuário de teste, apenas limpe o localStorage
            localStorage.removeItem('bestcode_user');
            setUser(null);
            
            toast({
              title: "Logout realizado",
              description: "Você foi desconectado com sucesso.",
            });
            return;
          }
        } catch (err) {
          console.error("Erro ao parsear usuário do localStorage:", err);
        }
      }
      
      // Para usuários normais, fazer logout no Supabase
      if (isSupabaseAvailable) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      
      // Limpar estado e localStorage em qualquer caso
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
