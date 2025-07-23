
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
        
        // First check if the user has an is_active property from context
        if (user.hasOwnProperty('is_active') && user.is_active === true) {
          console.log("User is active based on context data");
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
            console.error("Error fetching user status:", error);
            throw error;
          }
          
          console.log("User active status from database:", data?.is_active);
          setIsActive(data?.is_active || false);
        } else {
          // Non-students are always considered "active"
          console.log("Non-student user, setting active to true");
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

  useEffect(() => {
    // Log current state for debugging purposes
    console.log("ActiveUserRoute state:", {
      user: user ? { id: user.id, role: user.role, is_active: user.is_active } : null,
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
    console.log("Student account is not active, showing blocked message");
    toast.error("Seu acesso está inativo. Por favor, entre em contato com a equipe para reativar sua conta.");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833-.23 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Inativo</h3>
          <p className="text-sm text-gray-500 mb-6">
            Seu acesso está inativo. Por favor, entre em contato com a equipe para reativar sua conta.
          </p>
          <button
            onClick={() => window.location.href = "/login"}
            className="w-full bg-bestcode-600 text-white py-2 px-4 rounded-md hover:bg-bestcode-700 transition-colors"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  console.log("Access granted to user:", user.id);
  return <>{children}</>;
};

export default ActiveUserRoute;
