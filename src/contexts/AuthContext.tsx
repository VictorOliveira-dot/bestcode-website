
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
          toast({
            title: "Erro de configuração",
            description: "A conexão com Supabase não está configurada. Usando modo offline.",
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
      // Verifica rapidamente se é um dos usuários de teste
      const testUser = Object.values(TEST_USERS).find(
        u => u.email === email && u.password === password
      );
      
      if (testUser) {
        // Se for usuário de teste, use-o diretamente
        const { password: _, ...userWithoutPassword } = testUser;
        // Pequeno delay para evitar problemas de renderização
        await new Promise(resolve => setTimeout(resolve, 0)); 
        setUser(userWithoutPassword);
        localStorage.setItem('bestcode_user', JSON.stringify(userWithoutPassword));
        return userWithoutPassword;
      }
      
      // Se não for usuário de teste, tenta login com Supabase
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
          return userInfo;
        }
      }
      
      return null;
    } catch (err: any) {
      console.error("Erro durante login:", err);
      // If Supabase is not configured, show a message and allow fallback to test users
      if (err?.message?.includes('Supabase configuration is missing')) {
        toast({
          title: "Modo offline ativado",
          description: "Usando credenciais de teste local.",
          variant: "default",
        });
      } else {
        throw err;
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await supabaseLogout();
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
