
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'teacher' | 'student')[];
}

/**
 * Componente para proteger rotas com base na autenticação e no papel do usuário
 * Se não estiver autenticado, redireciona para o login
 * Se estiver autenticado mas não tiver o papel permitido, redireciona para a dashboard apropriada
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Enquanto estiver carregando, podemos mostrar um indicador de carregamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-bestcode-600"></div>
      </div>
    );
  }

  // Se não estiver logado, redireciona para o login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se houver papéis permitidos especificados e o usuário não estiver na lista
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirecionar para a dashboard apropriada com base no papel do usuário
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  // O usuário está autenticado e tem o papel correto
  return <>{children}</>;
};

export default ProtectedRoute;
