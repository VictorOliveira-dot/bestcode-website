// Mock client implementation - keeping the file for future reference
console.log('[Mock] Using mock data instead of Supabase');

// Mock data for responses
const MOCK_TEACHERS = [
  { id: '1', name: 'Professor Silva', email: 'silva@example.com', created_at: '2023-01-15', classes_count: 3, students_count: 45 },
  { id: '2', name: 'Professor Santos', email: 'santos@example.com', created_at: '2023-02-20', classes_count: 2, students_count: 28 },
  { id: '3', name: 'Professora Oliveira', email: 'oliveira@example.com', created_at: '2023-03-05', classes_count: 1, students_count: 15 }
];

const MOCK_COURSES = [
  { id: '1', name: 'Web Development', description: 'Learn full-stack web development', start_date: '2023-04-01', teacher_name: 'Professor Silva', students_count: 18, is_active: true },
  { id: '2', name: 'QA Testing', description: 'Quality assurance and testing methodologies', start_date: '2023-05-15', teacher_name: 'Professor Santos', students_count: 12, is_active: true },
  { id: '3', name: 'DevOps Basics', description: 'CI/CD and cloud infrastructure', start_date: '2023-06-10', teacher_name: 'Professora Oliveira', students_count: 8, is_active: false }
];

const MOCK_STUDENTS = [
  { id: '1', name: 'João Silva', email: 'joao@example.com', created_at: '2023-01-20', classes_count: 2, last_active: '2023-04-18', progress_average: 65 },
  { id: '2', name: 'Maria Santos', email: 'maria@example.com', created_at: '2023-02-10', classes_count: 1, last_active: '2023-04-15', progress_average: 78 },
  { id: '3', name: 'Pedro Oliveira', email: 'pedro@example.com', created_at: '2023-03-05', classes_count: 3, last_active: '2023-04-20', progress_average: 42 }
];

export const supabase = {
  auth: {
    signInWithPassword: async () => {
      return { data: null, error: null };
    },
    signOut: async () => {
      return { error: null };
    },
    getSession: async () => {
      return { data: { session: null }, error: null };
    },
    onAuthStateChange: () => {
      return {
        data: { subscription: { unsubscribe: () => {} } },
        error: null,
      };
    }
  },
  from: (table) => {
    return {
      select: (columns) => {
        return {
          eq: (column, value) => {
            return {
              single: async () => {
                // Mock response based on table
                if (table === 'enrollments') {
                  return { data: { class_id: '1', classes: { id: '1', name: 'Web Development' } }, error: null };
                }
                return { data: null, error: null };
              }
            };
          },
          in: (column, values) => {
            // Return mock data based on table
            if (table === 'lessons') {
              return {
                data: [
                  { id: '1', title: 'Intro to HTML', description: 'Learn HTML basics', youtube_url: 'https://youtube.com/watch?v=123', date: '2023-04-01', class_id: '1', visibility: 'all', classes: { id: '1', name: 'Web Development' } },
                  { id: '2', title: 'CSS Fundamentals', description: 'Styling with CSS', youtube_url: 'https://youtube.com/watch?v=456', date: '2023-04-08', class_id: '1', visibility: 'all', classes: { id: '1', name: 'Web Development' } }
                ],
                error: null
              };
            }
            return { data: [], error: null };
          },
          order: (column, { ascending }) => {
            return {
              data: table === 'notifications' ? [
                { id: '1', title: 'New lesson available', message: 'A new lesson has been added to your course', date: '2023-04-18', read: false },
                { id: '2', title: 'Assignment due', message: 'Your assignment is due tomorrow', date: '2023-04-15', read: true }
              ] : [],
              error: null
            };
          },
          single: async () => {
            return { data: null, error: null };
          }
        };
      },
      update: (data) => {
        return {
          eq: (column, value) => {
            return {
              eq: (anotherColumn, anotherValue) => {
                return { data: null, error: null };
              },
              data: null,
              error: null
            };
          },
          data: null, 
          error: null
        };
      },
      insert: (data) => {
        return { data: null, error: null };
      },
      delete: () => {
        return {
          eq: (column, value) => {
            return { data: null, error: null };
          }
        };
      }
    };
  },
  rpc: (functionName, params) => {
    // Handle different RPC functions
    if (functionName === 'admin_get_teachers') {
      return { data: MOCK_TEACHERS, error: null };
    } else if (functionName === 'admin_get_students_data') {
      return { data: MOCK_STUDENTS, error: null };
    } else if (functionName === 'admin_create_teacher') {
      return { data: '4', error: null }; // Return new mock teacher ID
    } else if (functionName === 'get_teacher_classes_simple') {
      return { data: [{ id: '1', name: 'Web Development' }, { id: '2', name: 'QA Testing' }], error: null };
    } else if (functionName === 'get_teacher_lessons') {
      return { 
        data: [
          { id: '1', title: 'Intro to HTML', description: 'Learn HTML basics', youtube_url: 'https://youtube.com/watch?v=123', date: '2023-04-01', class_id: '1', class_name: 'Web Development', visibility: 'all' },
          { id: '2', title: 'CSS Fundamentals', description: 'Styling with CSS', youtube_url: 'https://youtube.com/watch?v=456', date: '2023-04-08', class_id: '1', class_name: 'Web Development', visibility: 'all' }
        ], 
        error: null 
      };
    } else if (functionName === 'get_teacher_student_count') {
      return { data: 45, error: null };
    }
    return { data: null, error: null };
  },
  storage: {
    from: (bucket) => ({
      upload: async (path, file) => ({ data: { path }, error: null }),
      getPublicUrl: (path) => ({ data: { publicUrl: `https://example.com/${path}` } })
    })
  }
};
