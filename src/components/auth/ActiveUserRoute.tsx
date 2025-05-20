
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ActiveUserRouteProps {
  children: React.ReactNode;
}

const ActiveUserRoute: React.FC<ActiveUserRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) {
        setCheckingStatus(false);
        return;
      }

      try {
        // Apenas verificar is_active para estudantes
        if (user.role === 'student') {
          const { data, error } = await supabase
            .from("users")
            .select("is_active")
            .eq("id", user.id)
            .single();

          if (error) throw error;
          
          console.log("User active status:", data?.is_active);
          setIsActive(data?.is_active || false);
        } else {
          // Não-estudantes sempre são considerados "ativos"
          setIsActive(true);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        setIsActive(false);
      } finally {
        setCheckingStatus(false);
      }
    };

    if (!loading) {
      checkUserStatus();
    }
  }, [user, loading]);

  if (loading || checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bestcode-600"></div>
      </div>
    );
  }

  if (!user) {
    toast.error("Você precisa estar logado para acessar esta página");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role === 'student' && isActive === false) {
    toast.error("Sua conta está pendente de ativação. Conclua o pagamento para acessar.");
    return <Navigate to="/checkout" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ActiveUserRoute;
