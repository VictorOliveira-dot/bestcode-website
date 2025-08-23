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

  // Mutation para desvincular aluno
  const { mutateAsync: unenrollStudent } = useMutation({
    mutationFn: async ({ studentId, classId }: { studentId: string; classId: string }) => {
      if (!user?.id) throw new Error("Usuário não autenticado");

      const { error } = await supabase.rpc('unenroll_student_from_class', {
        p_student_id: studentId,
        p_class_id: classId,
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