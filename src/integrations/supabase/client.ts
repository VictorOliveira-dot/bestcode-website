
// This is a mock replacement for the Supabase client
// It provides mock implementations of the methods used in the project
// so the application can function until a real backend is implemented

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
          v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface MockQueryResult<T> {
  data: T | null;
  error: { message: string } | null;
  count?: number | null;
}

class MockSupabase {
  async rpc<T = any>(functionName: string, params?: Record<string, any>): Promise<MockQueryResult<T>> {
    console.log(`Mock RPC call to ${functionName} with params:`, params);
    
    // Return mock data based on the function being called
    if (functionName === 'admin_get_teachers') {
      return {
        data: [
          { 
            id: '101', 
            name: 'Professor Silva', 
            email: 'professor@bestcode.com',
            created_at: new Date().toISOString(),
            classes_count: 2,
            students_count: 15
          },
          { 
            id: '102', 
            name: 'Professora Santos', 
            email: 'santos@bestcode.com',
            created_at: new Date().toISOString(),
            classes_count: 1,
            students_count: 8
          }
        ] as unknown as T,
        error: null
      };
    }
    
    if (functionName === 'admin_get_students_data') {
      return {
        data: [
          {
            id: '201',
            name: 'Maria Aluna',
            email: 'aluno@bestcode.com',
            created_at: new Date().toISOString(),
            classes_count: 1,
            last_active: new Date().toISOString(),
            progress_average: 65.5
          },
          {
            id: '202',
            name: 'João Estudante',
            email: 'joao@estudante.com',
            created_at: new Date().toISOString(),
            classes_count: 2,
            last_active: new Date().toISOString(),
            progress_average: 48.2
          }
        ] as unknown as T,
        error: null
      };
    }
    
    if (functionName === 'get_teacher_classes_simple') {
      return {
        data: [
          { id: '301', name: 'Desenvolvimento Web' },
          { id: '302', name: 'QA e Testes Automáticos' }
        ] as unknown as T,
        error: null
      };
    }
    
    if (functionName === 'get_teacher_lessons') {
      return {
        data: [
          {
            id: '401',
            title: 'Introdução ao HTML e CSS',
            description: 'Fundamentos básicos de HTML e CSS para desenvolvimento web',
            youtube_url: 'https://www.youtube.com/watch?v=example1',
            date: new Date().toISOString().slice(0, 10),
            class_id: '301',
            class_name: 'Desenvolvimento Web',
            visibility: 'all'
          },
          {
            id: '402',
            title: 'JavaScript Avançado',
            description: 'Conceitos avançados de JavaScript para desenvolvimento web',
            youtube_url: 'https://www.youtube.com/watch?v=example2',
            date: new Date().toISOString().slice(0, 10),
            class_id: '301',
            class_name: 'Desenvolvimento Web',
            visibility: 'all'
          }
        ] as unknown as T,
        error: null
      };
    }
    
    if (functionName === 'get_teacher_student_count') {
      return {
        data: 23 as unknown as T,
        error: null
      };
    }
    
    if (functionName === 'admin_create_teacher' || functionName === 'admin_create_class') {
      return {
        data: generateUUID() as unknown as T,
        error: null
      };
    }
    
    // Default mock response
    return {
      data: null,
      error: { message: `Mock not implemented for function: ${functionName}` }
    };
  }

  from(table: string) {
    return {
      select: (columns: string = '*', options?: { count?: 'exact' | 'planned' | 'estimated' }) => {
        return {
          eq: (column: string, value: any) => {
            return {
              single: () => this.mockSelectSingle(table, column, value),
              in: (column: string, values: any[]) => this.mockSelectIn(table, column, values),
              // Other methods
              then: (callback: (result: any) => void) => {
                const mockResult = this.mockSelect(table, column, value);
                callback(mockResult);
                return mockResult;
              }
            };
          },
          in: (column: string, values: any[]) => this.mockSelectIn(table, column, values),
          order: (column: string, options?: { ascending?: boolean }) => {
            return {
              limit: (limit: number) => this.mockSelectLimit(table, limit),
              then: (callback: (result: any) => void) => {
                const mockResult = this.mockSelect(table);
                callback(mockResult);
                return mockResult;
              }
            };
          },
          limit: (limit: number) => this.mockSelectLimit(table, limit),
          range: (from: number, to: number) => this.mockSelectRange(table, from, to),
          then: (callback: (result: any) => void) => {
            const mockResult = this.mockSelect(table);
            callback(mockResult);
            return mockResult;
          }
        };
      },
      insert: (data: any, options?: { returning?: 'minimal' | 'representation' }) => {
        console.log(`Mock insert into ${table}:`, data);
        const mockId = generateUUID();
        return {
          select: (columns: string = '*') => ({
            then: (callback: (result: any) => void) => {
              const mockResult = {
                data: { ...data, id: mockId },
                error: null
              };
              callback(mockResult);
              return mockResult;
            }
          }),
          then: (callback: (result: any) => void) => {
            const mockResult = {
              data: { ...data, id: mockId },
              error: null
            };
            callback(mockResult);
            return mockResult;
          }
        };
      },
      update: (data: any) => {
        return {
          eq: (column: string, value: any) => {
            console.log(`Mock update ${table} where ${column}=${value}:`, data);
            return {
              then: (callback: (result: any) => void) => {
                const mockResult = {
                  data: { ...data, id: value },
                  error: null
                };
                callback(mockResult);
                return mockResult;
              }
            };
          }
        };
      },
      delete: () => {
        return {
          eq: (column: string, value: any) => {
            console.log(`Mock delete from ${table} where ${column}=${value}`);
            return {
              then: (callback: (result: any) => void) => {
                const mockResult = {
                  data: null,
                  error: null
                };
                callback(mockResult);
                return mockResult;
              }
            };
          }
        };
      }
    };
  }

  auth = {
    getSession: async () => {
      const mockUser = localStorage.getItem('mockUser');
      if (mockUser) {
        return {
          data: {
            session: {
              user: JSON.parse(mockUser),
              access_token: 'mock-token',
              refresh_token: 'mock-refresh-token',
              expires_at: Date.now() + 3600 * 1000,
              expires_in: 3600,
              token_type: 'bearer'
            }
          },
          error: null
        };
      }
      return { data: { session: null }, error: null };
    },
    refreshSession: async () => {
      const mockUser = localStorage.getItem('mockUser');
      if (mockUser) {
        return {
          data: {
            session: {
              user: JSON.parse(mockUser),
              access_token: 'mock-token',
              refresh_token: 'mock-refresh-token',
              expires_at: Date.now() + 3600 * 1000,
              expires_in: 3600,
              token_type: 'bearer'
            }
          },
          error: null
        };
      }
      return { data: { session: null }, error: null };
    },
    signInWithPassword: async ({ email, password }: { email: string, password: string }) => {
      console.log(`Mock signInWithPassword: ${email}, ${password}`);
      // Mock login based on test accounts
      if (
        (email === 'admin@bestcode.com' && password === 'admin123') || 
        (email === 'professor@bestcode.com' && password === 'teacher123') || 
        (email === 'aluno@bestcode.com' && password === 'student123')
      ) {
        let role = 'student';
        let name = 'Estudante Padrão';
        
        if (email === 'admin@bestcode.com') {
          role = 'admin';
          name = 'Admin Sistema';
        } else if (email === 'professor@bestcode.com') {
          role = 'teacher';
          name = 'Professor Silva';
        } else if (email === 'aluno@bestcode.com') {
          name = 'Maria Aluna';
        }
        
        const user = {
          id: generateUUID(),
          email: email,
          user_metadata: { name, role }
        };
        
        localStorage.setItem('mockUser', JSON.stringify(user));
        
        return {
          data: {
            user,
            session: {
              user,
              access_token: 'mock-token',
              refresh_token: 'mock-refresh-token',
              expires_at: Date.now() + 3600 * 1000,
              expires_in: 3600,
              token_type: 'bearer'
            }
          },
          error: null
        };
      }
      
      return {
        data: { user: null, session: null },
        error: { message: 'Email ou senha inválidos.' }
      };
    },
    signOut: async () => {
      localStorage.removeItem('mockUser');
      return { error: null };
    },
    signUp: async ({ email, password, options }: { 
      email: string, 
      password: string, 
      options?: { data?: Record<string, any> } 
    }) => {
      console.log(`Mock signUp: ${email}, ${options?.data?.name}, ${options?.data?.role}`);
      
      const user = {
        id: generateUUID(),
        email: email,
        user_metadata: options?.data || {}
      };
      
      // In real implementation, we wouldn't log in the user automatically after signup
      // due to email confirmation, but for mock purposes we do
      localStorage.setItem('mockUser', JSON.stringify(user));
      
      return {
        data: {
          user,
          session: {
            user,
            access_token: 'mock-token',
            refresh_token: 'mock-refresh-token',
            expires_at: Date.now() + 3600 * 1000,
            expires_in: 3600,
            token_type: 'bearer'
          }
        },
        error: null
      };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // No-op in mock version
      return {
        data: { subscription: { unsubscribe: () => {} } },
        error: null
      };
    }
  };

  private mockSelect(table: string, column?: string, value?: any) {
    console.log(`Mock select from ${table} ${column ? `where ${column}=${value}` : ''}`);
    
    let mockData: any[] = [];
    
    if (table === 'classes') {
      mockData = [
        {
          id: '301',
          name: 'Desenvolvimento Web',
          description: 'Curso completo de desenvolvimento web',
          start_date: new Date().toISOString().split('T')[0],
          teacher: { name: 'Professor Silva' },
          students: [{ student_id: '201' }, { student_id: '202' }],
          is_active: true
        },
        {
          id: '302',
          name: 'QA e Testes Automáticos',
          description: 'Curso de testes automatizados com Cypress',
          start_date: new Date().toISOString().split('T')[0],
          teacher: { name: 'Professora Santos' },
          students: [{ student_id: '203' }],
          is_active: true
        }
      ];
    }
    
    return {
      data: mockData,
      error: null
    };
  }

  private mockSelectSingle(table: string, column: string, value: any) {
    console.log(`Mock select single from ${table} where ${column}=${value}`);
    return {
      data: null, // Mock appropriate data here if needed
      error: null
    };
  }

  private mockSelectIn(table: string, column: string, values: any[]) {
    console.log(`Mock select from ${table} where ${column} in [${values.join(', ')}]`);
    return {
      data: [], // Mock appropriate data here if needed
      error: null
    };
  }

  private mockSelectLimit(table: string, limit: number) {
    console.log(`Mock select from ${table} limit ${limit}`);
    return {
      data: [], // Mock appropriate data here if needed
      error: null
    };
  }

  private mockSelectRange(table: string, from: number, to: number) {
    console.log(`Mock select from ${table} range ${from}-${to}`);
    return {
      data: [], // Mock appropriate data here if needed
      error: null
    };
  }
}

export const supabase = new MockSupabase();
