
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockAuthService } from '@/services/mockAuthService';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
}

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const currentUser = mockAuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await mockAuthService.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An error occurred during login'
      };
    }
  };

  const logout = async () => {
    try {
      const result = await mockAuthService.logout();
      if (result.success) {
        setUser(null);
      }
      return result;
    } catch (error) {
      return { success: false };
    }
  };

  const register = async (data: { email: string; password: string; name: string; role: string }) => {
    try {
      const result = await mockAuthService.register(data);
      return result;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An error occurred during registration'
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
