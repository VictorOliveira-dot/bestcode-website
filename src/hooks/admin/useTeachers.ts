
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Teacher {
  id: string;
  name: string;
  email: string;
  created_at: string;
  classes_count: number;
  students_count: number;
}

export const useTeachers = (shouldFetch: boolean = false) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTeachers = useCallback(async () => {
    if (!shouldFetch) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('admin_get_teachers');
      
      if (error) throw error;
      
      setTeachers(data || []);
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
    if (shouldFetch) {
      fetchTeachers();
    }
  }, [shouldFetch, fetchTeachers]);

  return { teachers, isLoading, fetchTeachers };
};
