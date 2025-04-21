
import { useState, useEffect } from 'react';
import { User } from './types';
import { supabase } from '@/integrations/supabase/client';

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider inicializado, verificando sessão existente...");
    
    // Configurar o listener de mudança de estado de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Estado de autenticação alterado:", event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log("Usuário autenticado:", session.user.id);
        await fetchAndSetUser(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        console.log("Usuário deslogado");
        setUser(null);
        localStorage.removeItem('bestcode_user');
      }
    });
    
    // DEPOIS verificar sessão atual
    const checkAuthState = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erro ao obter sessão:", sessionError);
          setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log("Sessão existente encontrada para usuário:", session.user.id);
          setTimeout(() => {
            fetchAndSetUser(session.user.id);
          }, 0);
        } else {
          console.log("Nenhuma sessão ativa encontrada");
          localStorage.removeItem('bestcode_user');
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error);
        setIsLoading(false);
      }
    };

    const fetchAndSetUser = async (userId: string) => {
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (userError) {
          console.error('Erro ao buscar detalhes do usuário:', userError);
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
          
          console.log("Dados do usuário definidos:", userInfo);
          setUser(userInfo);
          localStorage.setItem('bestcode_user', JSON.stringify(userInfo));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setIsLoading(false);
      }
    };
    
    checkAuthState();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, setUser, isLoading, setIsLoading };
}
