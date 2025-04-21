
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// User type com os dados essenciais incluindo o papel
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (data: { email: string; password: string; name: string; role: string }) => Promise<{ success: boolean; message?: string }>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => ({ success: false }),
  logout: () => {},
  register: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);

  // Função para buscar dados completos do usuário, incluindo o role
  const fetchUserData = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        return null;
      }
      
      return data as User;
    } catch (error) {
      console.error('Erro inesperado ao buscar dados do usuário:', error);
      return null;
    }
  };

  // Verificar sessão atual e configurar auth state listener
  useEffect(() => {
    // Configurar listener de mudanças de auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        
        if (newSession?.user) {
          // Usar setTimeout para evitar deadlock no Supabase
          setTimeout(async () => {
            const userData = await fetchUserData(newSession.user.id);
            if (userData) {
              setUser(userData);
            } else {
              // Se não encontrar dados do usuário na tabela 'users'
              setUser(null);
              console.error('Dados do usuário não encontrados na tabela users');
            }
            setLoading(false);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
        }
      }
    );

    // Verificar sessão existente ao carregar
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        
        if (initialSession?.user) {
          const userData = await fetchUserData(initialSession.user.id);
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar sessão inicial:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
    
    // Limpar subscription quando o componente for desmontado
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login com Supabase
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Erro de login:', error.message);
        return { success: false, message: error.message };
      }
      
      if (data.user) {
        // O usuário está autenticado, agora buscamos os dados completos
        const userData = await fetchUserData(data.user.id);
        
        if (userData) {
          // Atualizar estado de usuário no contexto
          setUser(userData);
          return { success: true };
        } else {
          // Dados do usuário não encontrados na tabela pública
          return { success: false, message: 'Conta de usuário incompleta. Por favor, contate o suporte.' };
        }
      }
      
      return { success: false, message: 'Não foi possível autenticar o usuário.' };
    } catch (error: any) {
      console.error('Erro inesperado no login:', error);
      return { success: false, message: error.message || 'Ocorreu um erro ao fazer login' };
    } finally {
      setLoading(false);
    }
  };

  // Logout com Supabase
  const logout = async () => {
    setLoading(true);
    
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível realizar o logout. Por favor, tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

  // Registro com Supabase e criação na tabela pública
  const register = async (data: { email: string; password: string; name: string; role: string }) => {
    setLoading(true);
    
    try {
      // Verificar se o papel solicitado é válido (apenas estudantes podem se registrar diretamente)
      if (data.role !== 'student') {
        return { success: false, message: 'Apenas contas de estudantes podem ser criadas por autoregistro.' };
      }
      
      // Registrar usuário no Auth do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role
          }
        }
      });
      
      if (authError) {
        console.error('Erro no registro:', authError.message);
        return { success: false, message: authError.message };
      }

      if (!authData?.user) {
        return { success: false, message: 'Não foi possível criar a conta.' };
      }
      
      // Inserir dados na tabela pública 'users'
      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: data.email,
            name: data.name,
            role: data.role
          }
        ]);
        
      if (userError) {
        console.error('Erro ao criar perfil de usuário:', userError);
        
        // Tentar reverter o cadastro em auth (embora seja difícil em prática)
        try {
          // Esta operação não é possível diretamente pelo cliente
          // Seria necessário uma função no servidor ou edge function
          console.warn('Não foi possível reverter o cadastro no auth. O usuário pode precisar ser removido manualmente.');
        } catch (e) {
          console.error('Erro ao tentar reverter cadastro:', e);
        }
        
        return { success: false, message: 'Erro ao criar perfil. Por favor, contate o suporte.' };
      }
      
      // Sucesso no cadastro - em produção, você pode querer esperar a verificação de email
      // ou redirecionar para um processo de pagamento
      return { success: true, message: 'Conta criada com sucesso!' };
    } catch (error: any) {
      console.error('Erro no processo de registro:', error);
      return { success: false, message: error.message || 'Erro ao registrar' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
