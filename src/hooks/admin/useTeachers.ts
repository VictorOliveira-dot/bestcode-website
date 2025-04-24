
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
      // Primeiro, buscar todos os professores
      const { data: teachersData, error: teachersError } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          created_at
        `)
        .eq('role', 'teacher');
      
      if (teachersError) throw teachersError;
      
      if (!teachersData || teachersData.length === 0) {
        setTeachers([]);
        setIsLoading(false);
        return;
      }
      
      // Preparar o array de professores com contagem zero inicial
      const processedTeachers = teachersData.map(teacher => ({
        ...teacher,
        classes_count: 0,
        students_count: 0
      }));
      
      // Agora, para cada professor, obter o número de classes em uma consulta separada
      const teachersWithCounts = await Promise.all(
        processedTeachers.map(async (teacher) => {
          // Buscar turmas do professor
          const { data: classesData, error: classesError } = await supabase
            .from('classes')
            .select('id, name')
            .eq('teacher_id', teacher.id);
          
          if (classesError) {
            console.error(`Erro ao buscar turmas para o professor ${teacher.id}:`, classesError);
            return teacher;
          }
          
          const classes = classesData || [];
          
          // Calcular o número de estudantes para as turmas deste professor
          let studentsCount = 0;
          if (classes.length > 0) {
            const classIds = classes.map(c => c.id);
            
            const { count, error: studentsError } = await supabase
              .from('enrollments')
              .select('student_id', { count: 'exact', head: true })
              .in('class_id', classIds);
              
            if (studentsError) {
              console.error(`Erro ao contar estudantes para o professor ${teacher.id}:`, studentsError);
            } else {
              studentsCount = count || 0;
            }
          }
          
          return {
            ...teacher,
            classes_count: classes.length,
            students_count: studentsCount,
            classes
          };
        })
      );
      
      setTeachers(teachersWithCounts);
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
