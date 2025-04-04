
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
}

// Define context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: 'student' | 'teacher' | 'admin') => Promise<void>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Test users
const TEST_USERS = {
  teacher: {
    id: '1',
    name: 'Professor Silva',
    email: 'professor@bestcode.com',
    password: 'teacher123',
    role: 'teacher' as const
  },
  student: {
    id: '2',
    name: 'Maria Aluna',
    email: 'aluno@bestcode.com',
    password: 'student123',
    role: 'student' as const
  },
  admin: {
    id: '3',
    name: 'Admin Sistema',
    email: 'admin@bestcode.com',
    password: 'admin123',
    role: 'admin' as const
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('bestcode_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string, role: 'student' | 'teacher' | 'admin') => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists based on role
    let testUser;
    if (role === 'teacher') {
      testUser = TEST_USERS.teacher;
    } else if (role === 'student') {
      testUser = TEST_USERS.student;
    } else if (role === 'admin') {
      testUser = TEST_USERS.admin;
    }
    
    if (testUser && email === testUser.email && password === testUser.password) {
      // Create user object without password
      const { password: _, ...userWithoutPassword } = testUser;
      
      // Set user state
      setUser(userWithoutPassword);
      
      // Store in localStorage
      localStorage.setItem('bestcode_user', JSON.stringify(userWithoutPassword));
      
      setIsLoading(false);
    } else {
      setIsLoading(false);
      throw new Error('Credenciais inválidas');
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('bestcode_user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
