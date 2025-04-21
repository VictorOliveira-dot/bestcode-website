
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './types/auth';
import { useAuthState } from './hooks/useAuthState';
import { loginWithEmail, logoutUser, registerUser } from './services/authService';

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => ({ success: false }),
  logout: () => {},
  register: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, session } = useAuthState();

  const login = async (email: string, password: string) => {
    return loginWithEmail(email, password);
  };

  const logout = async () => {
    await logoutUser();
  };

  const register = async (data: { email: string; password: string; name: string; role: string }) => {
    return registerUser(data);
  };

  console.log('Auth Provider state:', { 
    userExists: !!user, 
    loading, 
    sessionExists: !!session 
  });

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
