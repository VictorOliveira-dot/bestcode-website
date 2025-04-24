
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Teacher {
  id: string;
  name: string;
  email: string;
  created_at: string;
  classes_count: number;
  students_count: number;
  classes?: {
    id: string;
    name: string;
  }[];
}

export const useTeachers = (shouldFetch: boolean = true) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTeachers = useCallback(async () => {
    if (!shouldFetch) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          created_at,
          classes!inner (
            id,
            name
          )
        `)
        .eq('role', 'teacher');
      
      if (error) throw error;
      
      const processedTeachers = data.map(teacher => ({
        ...teacher,
        classes_count: teacher.classes?.length || 0,
        students_count: 0 // This needs to be implemented with a separate query or RPC
      }));

      setTeachers(processedTeachers);
    } catch (error: any) {
      console.error("Failed to fetch teachers:", error);
      toast({
        title: "Erro ao carregar professores",
        description: error.message || "Ocorreu um erro ao carregar os professores",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [shouldFetch]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  return { teachers, isLoading, fetchTeachers };
};
