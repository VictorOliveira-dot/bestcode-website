import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // If we've finished loading and there's no user, redirect immediately
    if (!loading && !user && location.pathname !== '/login') {
      console.log('AuthGuard: No user found, redirecting to login');
    }
  }, [loading, user, location]);

  // Show loading only for a brief moment while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-bestcode-600"></div>
      </div>
    );
  }

  // If no user after loading is complete, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;