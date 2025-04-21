
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
    console.log('[Auth Provider] Login attempt for:', email);
    return loginWithEmail(email, password);
  };

  const logout = async () => {
    console.log('[Auth Provider] Logout initiated');
    await logoutUser();
  };

  const register = async (data: { email: string; password: string; name: string; role: string }) => {
    console.log('[Auth Provider] Register attempt for:', data.email);
    return registerUser(data);
  };

  console.log('[Auth Provider] State:', { 
    userExists: !!user, 
    loading, 
    sessionExists: !!session,
    userRole: user?.role
  });

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
