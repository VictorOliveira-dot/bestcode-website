
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useStudentEnrollment() {
  const queryClient = useQueryClient();

  const { mutateAsync: enrollStudent, isPending } = useMutation({
    mutationFn: async ({ 
      studentId, 
      classId, 
      status = 'active' 
    }: { 
      studentId: string; 
      classId: string; 
      status?: string 
    }) => {
      // Verificar se já existe uma matrícula ativa
      const { data: existingEnrollment, error: checkError } = await supabase
        .from('enrollments')
        .select('id, status')
        .eq('student_id', studentId)
        .eq('class_id', classId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error(`Erro ao verificar matrícula existente: ${checkError.message}`);
      }

      if (existingEnrollment) {
        // Se já existe, atualizar o status
        const { error } = await supabase
          .from('enrollments')
          .update({ 
            status,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingEnrollment.id);
        
        if (error) throw error;
      } else {
        // Se não existe, criar nova matrícula
        const { error } = await supabase
          .from('enrollments')
          .insert({
            student_id: studentId,
            class_id: classId,
            status,
            user_id: studentId,
            enrollment_date: new Date().toISOString().split('T')[0]
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['all-students'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-students'] });
      toast({
        title: "Estudante vinculado",
        description: "O estudante foi vinculado à turma com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao vincular estudante",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    enrollStudent,
    isPending
  };
}
