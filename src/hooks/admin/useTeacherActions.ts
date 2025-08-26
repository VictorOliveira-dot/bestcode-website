import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TeacherDetails {
  id: string;
  name: string;
  email: string;
  created_at: string;
  classes: Array<{
    id: string;
    name: string;
  }>;
  classes_count: number;
  students_count: number;
}

export function useTeacherActions() {
  const queryClient = useQueryClient();

  const { mutateAsync: fetchTeacherDetails } = useMutation({
    mutationFn: async (teacherId: string) => {
      const { data, error } = await supabase.rpc('admin_get_teacher_details', { 
        p_teacher_id: teacherId 
      });
      
      if (error) throw error;
      return data?.[0] as TeacherDetails;
    }
  });

  const { mutateAsync: deleteTeacher } = useMutation({
    mutationFn: async (teacherId: string) => {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', teacherId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['admin_get_teachers'] });
      toast({
        title: "Professor excluído",
        description: "O professor foi excluído com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir professor",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    fetchTeacherDetails,
    deleteTeacher
  };
}