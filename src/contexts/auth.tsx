
import React, { createContext, useContext, useState, useEffect } from 'react';

// Simplified user type with just the essential fields
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
}

// Mock test users for development
const TEST_USERS = [
  { id: '1', email: 'admin@bestcode.com', name: 'Admin Sistema', role: 'admin' as const },
  { id: '2', email: 'professor@bestcode.com', name: 'Professor Silva', role: 'teacher' as const },
  { id: '3', email: 'aluno@bestcode.com', name: 'Maria Aluna', role: 'student' as const }
];

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (data: { email: string; password: string; name: string; role: string }) => Promise<{ success: boolean; message?: string }>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => ({ success: false }),
  logout: () => {},
  register: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for saved user in localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('mockUser');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user:', e);
        localStorage.removeItem('mockUser');
      }
    }
    
    setLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find user by email (case-insensitive)
      const foundUser = TEST_USERS.find(user => 
        user.email.toLowerCase() === email.toLowerCase()
      );
      
      if (!foundUser) {
        return { success: false, message: 'Usuário não encontrado' };
      }
      
      // In a real app, we'd validate the password here
      // We're accepting any password for the test accounts
      
      // Save user to state and localStorage
      setUser(foundUser);
      localStorage.setItem('mockUser', JSON.stringify(foundUser));
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Ocorreu um erro ao fazer login' };
    } finally {
      setLoading(false);
    }
  };

  // Mock logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  // Mock register function
  const register = async (data: { email: string; password: string; name: string; role: string }) => {
    setLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user with that email already exists
      const userExists = TEST_USERS.some(user => 
        user.email.toLowerCase() === data.email.toLowerCase()
      );
      
      if (userExists) {
        return { success: false, message: 'Um usuário com este email já existe' };
      }
      
      // In a real app, we'd create a new user here
      // For now, just return success but don't actually create anything
      
      return { success: true, message: 'Registro realizado com sucesso. Esta é uma implementação simulada.' };
    } catch (error: any) {
      console.error('Register error:', error);
      return { success: false, message: error.message || 'Ocorreu um erro ao registrar' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
