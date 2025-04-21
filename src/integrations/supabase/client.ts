// Mock client implementation - keeping the file for future reference
console.log('[Mock] Using mock data instead of Supabase');

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
    },
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
      }),
    }),
  }),
  rpc: () => ({ data: null, error: null }),
};
