
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

interface ActiveUserRouteProps {
  children: React.ReactNode;
}

const ActiveUserRoute: React.FC<ActiveUserRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("ActiveUserRoute state:", {
      user: user ? { id: user.id, role: user.role, is_active: user.is_active } : null,
      loading,
      location: location.pathname
    });
  }, [user, loading, location]);

  if (loading) {
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

  // Para estudantes, verificar se está ativo
  if (user.role === 'student' && !user.is_active) {
    console.log("Student account is not active, redirecting to checkout");
    toast.error("Sua conta está pendente de ativação. Conclua o pagamento para acessar.");
    return <Navigate to="/checkout" state={{ from: location }} replace />;
  }

  console.log("Access granted to user:", user.id);
  return <>{children}</>;
};

export default ActiveUserRoute;
