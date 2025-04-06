
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestQueryBuilder } from '@supabase/supabase-js';

export interface UseSupabaseBaseReturn {
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Base hook with common state and methods
export const useSupabaseBase = (): UseSupabaseBaseReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    loading,
    error,
    setLoading,
    setError
  };
};

// Generic fetch data function with type safety for table names
export const fetchSupabaseData = async <T>(
  table: 'classes' | 'users' | 'enrollments' | 'lesson_progress' | 'lessons' | 'notifications', 
  query?: any,
  setLoading?: (loading: boolean) => void,
  setError?: (error: string | null) => void
): Promise<T[]> => {
  if (setLoading) setLoading(true);
  if (setError) setError(null);
  
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .match(query || {});

    if (error) throw error;
    return data as T[];
  } catch (err: any) {
    if (setError) setError(err.message);
    return [];
  } finally {
    if (setLoading) setLoading(false);
  }
};
