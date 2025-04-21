
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthState, User } from '../types/auth';
import { fetchUserData } from '../services/authService';

export const useAuthState = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('Iniciando verificação de autenticação');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Evento de autenticação detectado:', event, newSession?.user?.id);
      
      if (newSession) {
        setSession(newSession);
        
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

    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('Sessão inicial:', initialSession?.user?.id);
      
      if (initialSession) {
        setSession(initialSession);
        
        if (initialSession.user) {
          setTimeout(async () => {
            const userData = await fetchUserData(initialSession.user.id);
            
            if (userData) {
              console.log('Dados iniciais do usuário:', userData);
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
            setLoading(false);
          }, 0);
        }
      } else {
        setLoading(false);
      }
    });

    return () => {
      console.log('Limpando subscription de autenticação');
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading };
};
