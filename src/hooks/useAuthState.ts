
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { fetchUserData } from '@/services/authService';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
}

// Convert this hook to a function component to properly access React hooks
export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Auth Provider: Initializing authentication...");
    setLoading(true);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        // Apenas atualize o estado do usuário para NULL quando o evento for SIGNED_OUT
        // Não faça o processo de login automático com SIGNED_IN
        if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing state");
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Verificar sessão inicial apenas para determinar se há loading ou não
    // Não configura o usuário automaticamente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        console.log("Initial session check: No active session");
        setLoading(false);
      } else {
        console.log("Initial session check: Session exists, but not auto-logging in");
        // Apenas marcar que não está mais carregando, mas não define o usuário
        setLoading(false);
      }
    });

    // Clean up subscription
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, setUser };
};
