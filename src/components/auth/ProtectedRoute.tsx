
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
      user: user ? { id: user.id, role: user.role, email: user.email } : null,
      allowedRoles,
      path: location.pathname
    });
  }, [loading, user, allowedRoles, location]);

  // While loading, show a loading indicator
  if (loading) {
    console.log("ProtectedRoute - Loading auth state...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-bestcode-600"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    console.log("ProtectedRoute - No user, redirecting to login");
    toast({
      variant: "destructive",
      title: "Acesso negado",
      description: "Faça login para acessar esta página",
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If there are allowed roles specified and the user doesn't have the role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log("ProtectedRoute - User doesn't have permission, role:", user.role);
    console.log("ProtectedRoute - Allowed roles:", allowedRoles);
    
    toast({
      variant: "destructive",
      title: "Acesso restrito",
      description: "Você não tem permissão para acessar esta página",
    });
    
    // Redirect to the appropriate dashboard based on user's role
    let redirectPath = "/";
    if (user.role === 'admin') {
      redirectPath = "/admin/dashboard";
      console.log("ProtectedRoute - Redirecting admin to:", redirectPath);
    } else if (user.role === 'teacher') {
      redirectPath = "/teacher/dashboard";
      console.log("ProtectedRoute - Redirecting teacher to:", redirectPath);
    } else if (user.role === 'student') {
      redirectPath = "/student/dashboard";
      console.log("ProtectedRoute - Redirecting student to:", redirectPath);
    }
    
    console.log("ProtectedRoute - Redirecting to:", redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // The user is authenticated and has the correct role
  console.log("ProtectedRoute - Access granted for role:", user.role);
  return <>{children}</>;
};

export default ProtectedRoute;
