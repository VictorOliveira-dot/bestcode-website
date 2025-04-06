
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { toast } from '@/hooks/use-toast';

// Define user types
export interface User {
  id: string;
  name?: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
}

// Define context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
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
  const { login: supabaseLogin, logout: supabaseLogout, getCurrentUser } = useSupabase();
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(true);

  // Verificar se usuário já está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        
        if (userData) {
          setUser({
            id: userData.id,
            name: userData.name || userData.email,
            email: userData.email,
            role: userData.role as 'student' | 'teacher' | 'admin'
          });
        } else {
          // Fallback para localStorage (compatibilidade com versões anteriores)
          const storedUser = localStorage.getItem('bestcode_user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // If Supabase is not configured, show a toast
        if ((error as any)?.message?.includes('Supabase configuration is missing')) {
          setIsSupabaseAvailable(false);
          toast({
            title: "Modo offline ativado",
            description: "Usando credenciais de teste local. Configure o Supabase para funcionalidade completa.",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [getCurrentUser]);

  // Login function
  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    
    try {
      // Primeiro tenta login com Supabase se estiver disponível
      if (isSupabaseAvailable) {
        try {
          const authData = await supabaseLogin(email, password);
          
          if (authData && authData.user) {
            // Busca dados completos do usuário
            const userData = await getCurrentUser();
            
            if (userData) {
              const userInfo: User = {
                id: userData.id,
                name: userData.name || userData.email,
                email: userData.email,
                role: userData.role as 'student' | 'teacher' | 'admin'
              };
              
              setUser(userInfo);
              
              // Armazena no localStorage como backup
              localStorage.setItem('bestcode_user', JSON.stringify(userInfo));
              
              return userInfo;
            }
          }
        } catch (err: any) {
          console.error("Erro ao fazer login no Supabase:", err);
          
          // Se erro de configuração, alterna para modo offline
          if (err?.message?.includes('Supabase configuration is missing')) {
            setIsSupabaseAvailable(false);
            toast({
              title: "Supabase não configurado",
              description: "Modo offline ativado. Usando credenciais de teste local.",
              variant: "destructive",
            });
          } 
          // Se credenciais inválidas, não prossiga para verificação de usuários de teste
          else if (err?.message?.includes('Invalid login credentials')) {
            setIsLoading(false);
            throw new Error("Credenciais inválidas");
          }
        }
      }
      
      // Fallback para usuários de teste se Supabase não estiver disponível
      if (!isSupabaseAvailable) {
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
            description: `Bem-vindo ${userWithoutPassword.name || email}! (Modo offline)`,
            variant: "default",
          });
          
          // Retorna o usuário para feedback imediato
          return userWithoutPassword;
        }
      }
      
      return null;
    } catch (err) {
      console.error("Erro durante login:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      if (isSupabaseAvailable) {
        await supabaseLogout();
      }
      setUser(null);
      localStorage.removeItem('bestcode_user');
    } catch (error) {
      console.error("Erro durante logout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        logout 
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
