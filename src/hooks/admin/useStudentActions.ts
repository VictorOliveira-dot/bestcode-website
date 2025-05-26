
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useStudentActions() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateEnrollment } = useMutation({
    mutationFn: async ({ 
      studentId, 
      classId, 
      status 
    }: { 
      studentId: string; 
      classId: string; 
      status: string 
    }) => {
      const { error } = await supabase.rpc('admin_update_student_enrollment', {
        p_student_id: studentId,
        p_class_id: classId,
        p_status: status
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['adminActiveStudentsCount'] });
      toast({
        title: "Matrícula atualizada",
        description: "Os dados do aluno foram atualizados com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar matrícula",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const { mutateAsync: deleteStudent } = useMutation({
    mutationFn: async (studentId: string) => {
      const { error } = await supabase.rpc('admin_delete_student', {
        p_student_id: studentId
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['adminActiveStudentsCount'] });
      toast({
        title: "Aluno excluído",
        description: "O aluno foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir aluno",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    updateEnrollment,
    deleteStudent
  };
}
