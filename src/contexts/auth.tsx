
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
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        return null;
      }

      if (!data) return null;

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
        console.log('Auth state changed:', event, newSession?.user?.id);
        
        if (newSession) {
          setSession(newSession);
          
          // Importante: Usar setTimeout para evitar deadlocks com Supabase
          setTimeout(async () => {
            if (newSession.user) {
              const userData = await fetchUserData(newSession.user.id);
              if (userData) {
                console.log('User data fetched:', userData);
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
            }
            setLoading(false);
          }, 0);
        } else {
          setUser(null);
          setSession(null);
          setLoading(false);
        }
      }
    );

    // Verificar sessão existente ao carregar
    const getInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();

        console.log('Initial session check:', initialSession?.user?.id);
        
        if (initialSession) {
          setSession(initialSession);

          if (initialSession.user) {
            const userData = await fetchUserData(initialSession.user.id);
            if (userData) {
              console.log('Initial user data:', userData);
              setUser(userData);
            } else {
              const metadata = initialSession.user.user_metadata || {};
              setUser({
                id: initialSession.user.id,
                email: initialSession.user.email || '',
                name: metadata.name || '',
                role: metadata.role || 'student'
              });
            }
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
      console.log('Tentando login com:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erro de login:', error.message);
        return { success: false, message: error.message };
      }

      if (data?.user) {
        console.log('Login bem-sucedido:', data.user.id);
        
        // Usar setTimeout para evitar problemas com eventos de autenticação
        setTimeout(async () => {
          const userData = await fetchUserData(data.user.id);
          
          if (userData) {
            console.log('Dados do usuário após login:', userData);
            setUser(userData);
          }
        }, 0);
        
        return { success: true };
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
        return { success: false, message: 'Erro ao criar perfil. Por favor, contate o suporte.' };
      }

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
