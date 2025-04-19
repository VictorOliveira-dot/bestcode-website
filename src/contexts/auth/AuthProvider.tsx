
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './types';
import { useSession } from './useSession';
import { useAuthActions } from './useAuthActions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, isLoading: sessionLoading } = useSession();
  const { login, register, logout, isLoading: actionLoading } = useAuthActions(setUser);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading: sessionLoading || actionLoading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
