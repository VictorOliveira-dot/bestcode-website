
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StudentFullDetails {
  user_id: string;
  name: string;
  email: string;
  created_at: string;
  current_classes: Array<{
    class_id: string;
    class_name: string;
    enrollment_date: string;
    status: string;
    teacher_name: string;
  }> | null;
  subscription_plan: string;
  progress_average: number;
  last_active: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  cpf: string | null;
  birth_date: string | null;
  address: string | null;
  education: string | null;
  professional_area: string | null;
  experience_level: string | null;
  goals: string | null;
  study_availability: string | null;
  is_profile_complete: boolean;
  gender: string | null;
  referral: string | null;
}

export const useStudentDetails = (studentId: string | null) => {
  return useQuery<StudentFullDetails>({
    queryKey: ["studentDetails", studentId],
    queryFn: async () => {
      if (!studentId) throw new Error("Student ID is required");
      
      console.log('[useStudentDetails] Fetching details for student:', studentId);
      
      const { data, error } = await supabase.rpc('admin_get_student_details', { 
        p_student_id: studentId 
      });
      
      if (error) {
        console.error('[useStudentDetails] Error:', error);
        throw error;
      }
      
      console.log('[useStudentDetails] Raw data received:', data);
      
      if (!data || data.length === 0) {
        throw new Error("Nenhum dado encontrado para este estudante");
      }
      
      const studentData = data[0] as StudentFullDetails;
      console.log('[useStudentDetails] Processed student data:', studentData);
      
      return studentData;
    },
    enabled: !!studentId
  });
};
