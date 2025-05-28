
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useStudentStatus() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateStudentStatus, isPending } = useMutation({
    mutationFn: async ({ studentId, isActive }: { studentId: string; isActive: boolean }) => {
      const { error } = await supabase.rpc('admin_update_student_status', {
        p_student_id: studentId,
        p_is_active: isActive
      });
      
      if (error) throw error;
    },
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: isActive ? "Aluno ativado" : "Aluno desativado",
        description: `O status do aluno foi ${isActive ? "ativado" : "desativado"} com sucesso.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    updateStudentStatus,
    isPending
  };
}
