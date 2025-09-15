
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
        // First check if the user has an is_active property from context
        if (user.hasOwnProperty('is_active') && user.is_active === true) {
          setIsActive(true);
          setCheckingStatus(false);
          return;
        }
        
        // Only check is_active for students
        if (user.role === 'student') {
          // Fetch the latest user data to ensure we have current activation status
          const { data, error } = await supabase
            .from("users")
            .select("is_active")
            .eq("id", user.id)
            .single();

          if (error) {
            throw error;
          }
          setIsActive(data?.is_active || false);
        } else {
          // Non-students are always considered "active"
          setIsActive(true);
        }
      } catch (error) {
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
    toast.error("Sua conta está pendente de ativação. Entre em contato conosco.");;
  }
  return <>{children}</>;
};

export default ActiveUserRoute;
