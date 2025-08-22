
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'teacher' | 'student')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While loading, show a loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-bestcode-600"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    toast({
      variant: "destructive",
      title: "Acesso negado",
      description: "Faça login para acessar esta página",
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If there are allowed roles specified and the user doesn't have the role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    toast({
      variant: "destructive",
      title: "Acesso restrito", 
      description: "Você não tem permissão para acessar esta página",
    });
    
    // Redirect to the appropriate dashboard based on user's role
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

  // The user is authenticated and has the correct role
  return <>{children}</>;
};

export default ProtectedRoute;
