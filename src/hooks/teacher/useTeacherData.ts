
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

export const useTeacherData = () => {
  const { user } = useAuth();

  const {
    data: classes = [],
    isLoading: isLoadingClasses,
    error: classesError,
    refetch: refetchClasses
  } = useQuery({
    queryKey: ["teacherClasses", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.error("No user ID available for querying classes");
        return [];
      }
      
      console.log("Fetching classes for teacher ID:", user.id);
      
      const { data, error } = await supabase.rpc('get_teacher_classes', {
        teacher_id: user.id
      });

      if (error) {
        console.error("Error fetching teacher classes:", error);
        throw error;
      }
      
      console.log("Fetched classes data:", data);
      
      // Transform data to ensure it has the right format
      const formattedClasses = data?.map((cls: any) => ({
        id: cls.id,
        name: cls.name,
        description: cls.description,
        start_date: cls.start_date,
        students_count: cls.students_count || 0
      })) || [];
      
      console.log("Formatted classes:", formattedClasses);
      return formattedClasses;
    },
    enabled: !!user?.id,
    staleTime: 30000,
    gcTime: 1000 * 60 * 5,
  });

  const { 
    data: studentCount = 0,
    isLoading: isLoadingStudentCount
  } = useQuery({
    queryKey: ["teacherStudentCount", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.error("No user ID available for querying student count");
        return 0;
      }
      
      console.log("Fetching student count for teacher ID:", user.id);
      
      const { data, error } = await supabase.rpc('get_teacher_student_count', {
        teacher_id: user.id
      });

      if (error) {
        console.error("Error fetching teacher student count:", error);
        throw error;
      }
      
      console.log("Fetched student count:", data);
      return data || 0;
    },
    enabled: !!user?.id,
    staleTime: 30000,
    gcTime: 1000 * 60 * 5,
  });

  const {
    data: lessons = [],
    isLoading: isLoadingLessons,
    error: lessonsError,
    refetch: refetchLessons
  } = useQuery({
    queryKey: ["teacherLessons", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.error("No user ID available for querying lessons");
        return [];
      }
      
      console.log("Fetching lessons for teacher ID:", user.id);
      
      const { data, error } = await supabase.rpc('get_teacher_lessons', {
        teacher_id: user.id
      });

      if (error) {
        console.error("Error fetching teacher lessons:", error);
        throw error;
      }
      
      console.log("Fetched lessons:", data);
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 30000,
    gcTime: 1000 * 60 * 5,
  });

  return {
    classes,
    studentCount,
    lessons,
    isLoading: isLoadingClasses || isLoadingLessons || isLoadingStudentCount,
    error: classesError || lessonsError,
    refetchClasses,
    refetchLessons
  };
};
