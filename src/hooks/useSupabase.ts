
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async <T>(table: string, query?: any): Promise<T[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .match(query || {});

      if (error) throw error;
      return data as T[];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, loading, error };
};
