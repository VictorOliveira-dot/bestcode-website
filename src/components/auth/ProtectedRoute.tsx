
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'teacher' | 'student')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProtectedRoute - Current auth state:", { 
      loading, 
      user: user ? { role: user.role, email: user.email } : null,
      allowedRoles,
      path: location.pathname
    });
  }, [loading, user, allowedRoles, location]);

  // Enquanto estiver carregando, podemos mostrar um indicador de carregamento
  if (loading) {
    console.log("ProtectedRoute - Loading auth state...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-bestcode-600"></div>
      </div>
    );
  }

  // Se não estiver logado, redireciona para o login
  if (!user) {
    console.log("ProtectedRoute - No user, redirecting to login");
    toast({
      variant: "destructive",
      title: "Acesso negado",
      description: "Faça login para acessar esta página",
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se houver papéis permitidos especificados e o usuário não estiver na lista
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log("ProtectedRoute - User doesn't have permission, redirecting to appropriate dashboard");
    toast({
      variant: "destructive",
      title: "Acesso restrito",
      description: "Você não tem permissão para acessar esta página",
    });
    
    // Redirecionar para a dashboard apropriada com base no papel do usuário
    let redirectPath = "/";
    if (user.role === 'admin') {
      redirectPath = "/admin/dashboard";
    } else if (user.role === 'teacher') {
      redirectPath = "/teacher/dashboard";
    } else if (user.role === 'student') {
      redirectPath = "/student/dashboard";
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  // O usuário está autenticado e tem o papel correto
  console.log("ProtectedRoute - Access granted");
  return <>{children}</>;
};

export default ProtectedRoute;
