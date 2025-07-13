
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

export interface StudentLessonDetail {
  lesson_id: string;
  lesson_title: string;
  lesson_date: string;
  status: string;
  watch_time_minutes: number;
  last_watch: string | null;
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
      
      try {
        const { data, error } = await supabase.rpc('get_teacher_student_progress', {
          p_teacher_id: user.id
        });

        if (error) {
          console.error("Error fetching teacher student progress:", error);
          throw error;
        }
        
        console.log("Fetched student progress:", data);
        return data || [];
      } catch (err) {
        console.error("Failed to fetch student progress:", err);
        throw err;
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // Cache por 2 minutos
    gcTime: 1000 * 60 * 10, // Garbage collection em 10 minutos
    retry: 2,
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
      
      try {
        const { data, error } = await supabase.rpc('get_teacher_classes_simple', {
          teacher_id: user.id
        });

        if (error) {
          console.error("Error fetching teacher classes for filter:", error);
          throw error;
        }
        
        return data || [];
      } catch (err) {
        console.error("Failed to fetch teacher classes:", err);
        throw err;
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    gcTime: 1000 * 60 * 15, // Garbage collection em 15 minutos
  });

  const fetchStudentLessonDetails = async (studentId: string): Promise<StudentLessonDetail[]> => {
    if (!user?.id) {
      throw new Error("Teacher ID not available");
    }

    try {
      const { data, error } = await supabase.rpc('get_student_lesson_details', {
        p_student_id: studentId,
        p_teacher_id: user.id
      });

      if (error) {
        console.error("Error fetching student lesson details:", error);
        throw error;
      }
      
      console.log("Fetched student lesson details:", data);
      return data || [];
    } catch (err) {
      console.error("Failed to fetch student lesson details:", err);
      throw err;
    }
  };

  return {
    students,
    availableClasses,
    isLoading: isLoading || isLoadingClasses,
    error,
    refetch,
    fetchStudentLessonDetails
  };
};
