
// Define user types
export interface User {
  id: string;
  name?: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar_url?: string;
}

// Define context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData: any) => Promise<any>;
}
