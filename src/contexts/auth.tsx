
import React, { createContext, useContext } from 'react';
import { useAuthState, AuthUser } from '@/hooks/useAuthState';
import { loginUser, logoutUser, registerUser } from '@/services/authService';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<{ success: boolean }>;
  register: (data: { email: string; password: string; name: string; role: string }) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => ({ success: false }),
  logout: async () => ({ success: false }),
  register: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuthState();

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login: loginUser,
      logout: logoutUser,
      register: registerUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
