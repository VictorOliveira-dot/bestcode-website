
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
      console.log("Fetching teachers from admin_get_teachers function");
      
      const { data: teachersData, error } = await supabase.rpc('admin_get_teachers');
      
      if (error) {
        console.error("Error fetching teachers:", error);
        throw error;
      }
      
      console.log("Teachers data retrieved:", teachersData);
      setTeachers(teachersData || []);
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

  return { 
    teachers, 
    isLoading, 
    fetchTeachers,
    refetch: fetchTeachers // Adicionar alias para compatibilidade
  };
};
