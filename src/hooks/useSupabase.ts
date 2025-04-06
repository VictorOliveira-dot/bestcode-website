
import { useState } from 'react';
import { useSupabaseBase, fetchSupabaseData } from './supabase/useSupabaseBase';
import { useSupabaseAuth } from './supabase/useSupabaseAuth';
import { useSupabaseLessons } from './supabase/useSupabaseLessons';
import { useSupabaseNotifications } from './supabase/useSupabaseNotifications';
import { supabase } from '@/integrations/supabase/client';

export const useSupabase = () => {
  // Use all the separate hooks
  const base = useSupabaseBase();
  const authHook = useSupabaseAuth();
  const lessonsHook = useSupabaseLessons();
  const notificationsHook = useSupabaseNotifications();
  
  // Combine loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Generic data fetching function
  const fetchData = async <T>(table: string, query?: any): Promise<T[]> => {
    return fetchSupabaseData<T>(table, query, setLoading, setError);
  };

  return {
    // Core functionality
    fetchData,
    loading: loading || base.loading || authHook.loading || lessonsHook.loading || notificationsHook.loading,
    error: error || base.error || authHook.error || lessonsHook.error || notificationsHook.error,
    
    // Auth functions
    ...authHook,
    
    // Lessons functions
    ...lessonsHook,
    
    // Notifications functions
    ...notificationsHook
  };
};
