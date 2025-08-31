import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

export interface StudentEnrollment {
  enrollment_id: string;
  class_id: string;
  class_name: string;
}

export const useStudentEnrollments = (studentId: string) => {
  const { user } = useAuth();

  const {
    data: enrollments = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["studentEnrollments", studentId, user?.id],
    queryFn: async () => {
      if (!user?.id || !studentId) return [];
      
      const { data, error } = await supabase.rpc('get_student_class_enrollments', {
        p_student_id: studentId,
        p_teacher_id: user.id
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && !!studentId,
    staleTime: 1000 * 60 * 2, // Cache por 2 minutos
  });

  return {
    enrollments,
    isLoading,
    error
  };
};