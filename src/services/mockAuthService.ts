
interface MockUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
}

const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'admin@bestcode.com',
    name: 'Admin Sistema',
    role: 'admin'
  },
  {
    id: '2',
    email: 'professor@bestcode.com',
    name: 'Professor Silva',
    role: 'teacher'
  },
  {
    id: '3',
    email: 'aluno@bestcode.com',
    name: 'Maria Aluna',
    role: 'student'
  }
];

export const mockAuthService = {
  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === 'Senha123!') {
      // Store in localStorage to persist session
      localStorage.setItem('mockUser', JSON.stringify(user));
      return { success: true, user };
    }
    
    return { 
      success: false, 
      message: 'Email ou senha inválidos'
    };
  },

  logout: async () => {
    localStorage.removeItem('mockUser');
    return { success: true };
  },

  getCurrentUser: () => {
    const stored = localStorage.getItem('mockUser');
    if (stored) {
      return JSON.parse(stored) as MockUser;
    }
    return null;
  },

  register: async (data: { email: string; password: string; name: string; role: string }) => {
    // In a mock implementation, we'll just return success
    // In a real app, this would create a new user
    return { 
      success: true,
      message: 'Mock registration successful'
    };
  }
};
