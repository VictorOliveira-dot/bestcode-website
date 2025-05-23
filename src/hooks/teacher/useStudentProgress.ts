
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

export interface StudentProgressData {
  id: string;
  name: string;
  email: string;
  class_name: string;
  last_activity: string | null;
  completed_lessons: number;
  total_lessons: number;
  progress: number;
}

export const useStudentProgress = () => {
  const { user } = useAuth();

  const {
    data: students = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["teacherStudentProgress", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.error("No user ID available for querying student progress");
        return [];
      }
      
      console.log("Fetching student progress for teacher ID:", user.id);
      
      const { data, error } = await supabase.rpc('get_teacher_student_progress', {
        teacher_id: user.id
      });

      if (error) {
        console.error("Error fetching teacher student progress:", error);
        throw error;
      }
      
      console.log("Fetched student progress:", data);
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 30000,
    gcTime: 1000 * 60 * 5,
  });

  const {
    data: availableClasses = [],
    isLoading: isLoadingClasses
  } = useQuery({
    queryKey: ["teacherClassesForFilter", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }
      
      const { data, error } = await supabase.rpc('get_teacher_classes_simple', {
        teacher_id: user.id
      });

      if (error) {
        console.error("Error fetching teacher classes for filter:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 30000,
    gcTime: 1000 * 60 * 5,
  });

  return {
    students,
    availableClasses,
    isLoading: isLoading || isLoadingClasses,
    error,
    refetch
  };
};
