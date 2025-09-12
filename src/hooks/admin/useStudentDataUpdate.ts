
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface StudentDataUpdate {
  student_id: string;
  name?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  whatsapp?: string;
  cpf?: string;
  birth_date?: string;
  address?: string;
  education?: string;
  professional_area?: string;
  experience_level?: string;
  goals?: string;
  study_availability?: string;
}

export function useStudentDataUpdate() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateStudentData, isPending } = useMutation({
    mutationFn: async (data: StudentDataUpdate) => {
      const studentId = data.student_id;
      if (!studentId) throw new Error("ID do aluno não informado");

      const { error } = await supabase.rpc('admin_update_student_data', {
        p_student_id: studentId,
        p_name: data.name || null,
        p_email: data.email || null,
        p_first_name: data.first_name || null,
        p_last_name: data.last_name || null,
        p_phone: data.phone ? data.phone.replace(/\D/g, '') : null,
        p_whatsapp: data.whatsapp ? data.whatsapp.replace(/\D/g, '') : null,
        p_cpf: data.cpf ? data.cpf.replace(/\D/g, '') : null,
        p_birth_date: data.birth_date ? new Date(data.birth_date).toISOString().split('T')[0] : null,
        p_address: data.address || null,
        p_education: data.education || null,
        p_professional_area: data.professional_area || null,
        p_experience_level: data.experience_level || null,
        p_goals: data.goals || null,
        p_study_availability: data.study_availability || null,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Dados atualizados",
        description: "Os dados do aluno foram atualizados com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar dados",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    updateStudentData,
    isUpdating: isPending
  };
}
