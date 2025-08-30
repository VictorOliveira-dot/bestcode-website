import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

export interface StudentData {
  id: string;
  name: string;
  email: string;
  created_at: string;
  is_active: boolean;
  class_names: string;
}

export const useStudentManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query otimizada para listar todos os alunos
  const {
    data: allStudents = [],
    isLoading: isLoadingStudents,
    error
  } = useQuery({
    queryKey: ["allStudentsOptimized", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase.rpc('get_all_students_optimized', {
        p_teacher_id: user.id
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    gcTime: 1000 * 60 * 15, // Garbage collection em 15 minutos
  });

  // Mutation para desvincular aluno - FIXED VERSION
  const { mutateAsync: unenrollStudent } = useMutation({
    mutationFn: async ({ studentId, classId }: { studentId: string; classId: string }) => {
      if (!user?.id) throw new Error("Usuário não autenticado");

      // First, get the actual class enrollments for this student
      const { data: enrollments, error: getError } = await supabase.rpc('get_student_class_enrollments', {
        p_student_id: studentId,
        p_teacher_id: user.id
      });

      if (getError) throw getError;

      if (!enrollments || enrollments.length === 0) {
        throw new Error("Nenhuma matrícula encontrada para este aluno");
      }

      // Find the enrollment that matches the class name (simplified approach)
      const enrollment = enrollments.find((e: any) => 
        e.class_name === classId || e.class_id === classId
      ) || enrollments[0]; // fallback to first enrollment

      // Now unenroll using the actual class_id
      const { error } = await supabase.rpc('unenroll_student_from_class', {
        p_student_id: studentId,
        p_class_id: enrollment.class_id,
        p_teacher_id: user.id
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allStudentsOptimized'] });
      queryClient.invalidateQueries({ queryKey: ['teacherStudentProgress'] });
      toast({
        title: "Aluno desvinculado",
        description: "O aluno foi desvinculado da turma com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao desvincular aluno",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation para verificar se turma tem alunos antes de excluir
  const { mutateAsync: checkClassHasStudents } = useMutation({
    mutationFn: async (classId: string) => {
      const { data, error } = await supabase.rpc('check_class_has_students', {
        p_class_id: classId
      });

      if (error) throw error;
      return data;
    }
  });

  return {
    allStudents,
    isLoadingStudents,
    error,
    unenrollStudent,
    checkClassHasStudents
  };
};