
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
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

  // Verificar sessão atual e configurar auth state listener
  useEffect(() => {
    console.log('Iniciando verificação de autenticação');
    
    // Primeiro, verificamos a sessão existente
    const getInitialSession = async () => {
      try {
        console.log('Verificando sessão inicial');
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        console.log('Sessão inicial:', initialSession?.user?.id);
        
        if (initialSession) {
          setSession(initialSession);
          
          if (initialSession.user) {
            // Importante: usar setTimeout para evitar deadlocks
            setTimeout(async () => {
              const userData = await fetchUserData(initialSession.user.id);
              
              if (userData) {
                console.log('Dados iniciais do usuário:', userData);
                setUser(userData);
              } else {
                const metadata = initialSession.user.user_metadata || {};
                const newUser = {
                  id: initialSession.user.id,
                  email: initialSession.user.email || '',
                  name: metadata.name || '',
                  role: metadata.role || 'student'
                };
                console.log('Criando user state a partir de metadata:', newUser);
                setUser(newUser);
              }
            }, 0);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar sessão inicial:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Configurar listener de mudanças de auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Evento de autenticação detectado:', event, newSession?.user?.id);
      
      if (newSession) {
        setSession(newSession);
        
        // Sem código assíncrono no callback principal
        // Em vez disso, usamos setTimeout
        if (newSession.user) {
          setTimeout(async () => {
            const userData = await fetchUserData(newSession.user.id);
            
            if (userData) {
              console.log('Dados do usuário atualizados:', userData);
              setUser(userData);
            } else {
              const metadata = newSession.user.user_metadata || {};
              setUser({
                id: newSession.user.id,
                email: newSession.user.email || '',
                name: metadata.name || '',
                role: metadata.role || 'student'
              });
            }
            setLoading(false);
          }, 0);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('Usuário desconectado');
        setUser(null);
        setSession(null);
        setLoading(false);
      }
    });

    // Executar a verificação inicial
    getInitialSession();

    // Limpar subscription quando o componente for desmontado
    return () => {
      console.log('Limpando subscription de autenticação');
      subscription.unsubscribe();
    };
  }, []);

  // Login com Supabase - corrigido para evitar problemas de sincronização
  const login = async (email: string, password: string) => {
    console.log('Iniciando processo de login para:', email);
    setLoading(true);

    try {
      // Chamada de login do Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // Se houver erro, retornamos imediatamente
      if (error) {
        console.error('Erro de autenticação:', error);
        setLoading(false);
        return { 
          success: false, 
          message: error.message || 'Credenciais inválidas. Verifique seu email e senha.' 
        };
      }

      // Se não houver usuário nos dados retornados
      if (!data?.user) {
        console.error('Login falhou: Nenhum usuário retornado');
        setLoading(false);
        return { 
          success: false, 
          message: 'Falha ao autenticar. Por favor, tente novamente.' 
        };
      }

      console.log('Login bem-sucedido para:', data.user.email);
      
      // Não fazemos o fetchUserData aqui - o onAuthStateChange vai lidar com isso
      // para evitar problemas de sincronização
      
      setLoading(false);
      return { success: true };

    } catch (error: any) {
      console.error('Erro inesperado durante login:', error);
      setLoading(false);
      return { 
        success: false, 
        message: error.message || 'Ocorreu um erro ao fazer login' 
      };
    }
  };

  // Logout com Supabase
  const logout = async () => {
    console.log('Iniciando processo de logout');
    setLoading(true);

    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      console.log('Logout realizado com sucesso');
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
    console.log('Iniciando registro de novo usuário:', data.email);
    setLoading(true);

    try {
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
        console.error('Erro no registro:', authError);
        setLoading(false);
        return { success: false, message: authError.message };
      }

      if (!authData?.user) {
        console.error('Registro falhou: Nenhum usuário criado');
        setLoading(false);
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
        setLoading(false);
        return { success: false, message: 'Erro ao criar perfil. Por favor, contate o suporte.' };
      }

      console.log('Usuário registrado com sucesso:', data.email);
      setLoading(false);
      return { success: true, message: 'Conta criada com sucesso!' };
    } catch (error: any) {
      console.error('Erro no processo de registro:', error);
      setLoading(false);
      return { success: false, message: error.message || 'Erro ao registrar' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
