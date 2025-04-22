
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

export const useTeacherData = () => {
  const { user } = useAuth();

  const {
    data: classes,
    isLoading: isLoadingClasses,
    error: classesError,
    refetch: refetchClasses
  } = useQuery({
    queryKey: ["teacherClasses", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc("get_teacher_classes", {
          teacher_id: user?.id
        });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { 
    data: studentCount,
    isLoading: isLoadingStudentCount
  } = useQuery({
    queryKey: ["teacherStudentCount", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc("get_teacher_student_count", {
          teacher_id: user?.id
        });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const {
    data: lessons,
    isLoading: isLoadingLessons,
    error: lessonsError,
    refetch: refetchLessons
  } = useQuery({
    queryKey: ["teacherLessons", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc("get_teacher_lessons", {
          teacher_id: user?.id
        });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  return {
    classes: classes || [],
    studentCount: studentCount || 0,
    lessons: lessons || [],
    isLoading: isLoadingClasses || isLoadingLessons || isLoadingStudentCount,
    error: classesError || lessonsError,
    refetchClasses,
    refetchLessons
  };
};
