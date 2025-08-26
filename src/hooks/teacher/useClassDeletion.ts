import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

export const useClassDeletion = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutateAsync: deleteClass, isPending } = useMutation({
    mutationFn: async (classId: string) => {
      if (!user?.id) throw new Error("Usuário não autenticado");

      // First check if class has students
      const { data: hasStudents, error: checkError } = await supabase.rpc('check_class_has_students', {
        p_class_id: classId
      });

      if (checkError) throw checkError;

      if (hasStudents) {
        throw new Error("Não é possível excluir turma com alunos vinculados. Desvincule todos os alunos primeiro.");
      }

      // Delete the class
      const { error } = await supabase.rpc('delete_class', {
        p_class_id: classId,
        p_teacher_id: user.id
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherClasses'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({
        title: "Turma excluída",
        description: "A turma foi excluída com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir turma",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    deleteClass,
    isPending
  };
};