
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";

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
      const { data, error } = await supabase.rpc('get_teacher_classes', {
        teacher_id: user?.id
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes (renamed from cacheTime)
  });

  const { 
    data: studentCount = 0,
    isLoading: isLoadingStudentCount
  } = useQuery({
    queryKey: ["teacherStudentCount", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_teacher_student_count', {
        teacher_id: user?.id
      });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    staleTime: 30000,
    gcTime: 1000 * 60 * 5, // Renamed from cacheTime
  });

  const {
    data: lessons = [],
    isLoading: isLoadingLessons,
    error: lessonsError,
    refetch: refetchLessons
  } = useQuery({
    queryKey: ["teacherLessons", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_teacher_lessons', {
        teacher_id: user?.id
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 30000,
    gcTime: 1000 * 60 * 5, // Renamed from cacheTime
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
