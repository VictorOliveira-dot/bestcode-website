
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
        console.log("Checking active status for user:", user.id, "with role:", user.role);
        
        // For non-students, always consider them active
        if (user.role !== 'student') {
          console.log("Non-student user, setting active to true");
          setIsActive(true);
          setCheckingStatus(false);
          return;
        }
        
        // First check if the user already has an is_active property from context
        if (user.hasOwnProperty('is_active')) {
          console.log("User active status from context:", user.is_active);
          setIsActive(!!user.is_active); // Convert to boolean
          setCheckingStatus(false);
          return;
        }
        
        // If not available in context, check from database
        const { data, error } = await supabase
          .from("users")
          .select("is_active")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user status:", error);
          throw error;
        }
          
        console.log("User active status from database:", data?.is_active);
        setIsActive(!!data?.is_active); // Convert to boolean
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

  // Log current state for debugging purposes
  useEffect(() => {
    console.log("ActiveUserRoute state:", {
      user: user ? { 
        id: user.id, 
        role: user.role, 
        is_active: user.is_active 
      } : null,
      isActive,
      loading,
      checkingStatus,
      location: location.pathname
    });
  }, [user, isActive, loading, checkingStatus, location]);

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
    console.log("Student account is not active, redirecting to checkout");
    toast.error("Sua conta está pendente de ativação. Conclua o pagamento para acessar.");
    return <Navigate to="/checkout" state={{ from: location }} replace />;
  }

  console.log("Access granted to user:", user.id);
  return <>{children}</>;
};

export default ActiveUserRoute;
