
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
    queryKey: ["allClasses"],
    queryFn: async () => {
      // console.log("Fetching all classes for teachers");
      
      const { data, error } = await supabase.rpc('get_all_classes_for_teachers');

      if (error) {
        console.error("Error fetching all classes:", error);
        throw error;
      }
      
      // console.log("Fetched all classes:", data);
      return data?.map(cls => ({
        id: cls.id,
        name: cls.name,
        description: cls.description,
        startDate: cls.start_date,
        studentsCount: cls.students_count || 0,
        teacher_id: cls.teacher_id,
        teacher_name: cls.teacher_name || 'N/A'
      })) || [];
    },
    staleTime: 30000,
    gcTime: 1000 * 60 * 5,
  });

  const { 
    data: studentCount = 0,
    isLoading: isLoadingStudentCount
  } = useQuery({
    queryKey: ["allStudentsCount"],
    queryFn: async () => {
      // console.log("Fetching total student count");
      
      const { data, error } = await supabase.rpc('get_all_students_for_teachers');

      if (error) {
        console.error("Error fetching total student count:", error);
        throw error;
      }
      
      // console.log("Fetched total student count:", data?.length || 0);
      return data?.length || 0;
    },
    staleTime: 60000,
    gcTime: 1000 * 60 * 10,
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
      
      // console.log("Fetching lessons for teacher ID:", user.id);
      
      const { data, error } = await supabase.rpc('get_teacher_lessons', {
        teacher_id: user.id
      });

      if (error) {
        console.error("Error fetching teacher lessons:", error);
        throw error;
      }
      
      // console.log("Fetched lessons:", data);
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 30000,
    gcTime: 1000 * 60 * 5,
  });

  const {
    data: allStudents = [],
    isLoading: isLoadingAllStudents,
    refetch: refetchAllStudents
  } = useQuery({
    queryKey: ["allStudents"],
    queryFn: async () => {
      // console.log("Fetching all students for teachers");
      
      const { data, error } = await supabase.rpc('get_all_students_for_teachers');

      if (error) {
        console.error("Error fetching all students:", error);
        throw error;
      }
      
      // console.log("Fetched all students:", data);
      return data || [];
    },
    staleTime: 60000,
    gcTime: 1000 * 60 * 10,
  });

  const {
    data: teacherClasses = [],
    isLoading: isLoadingTeacherClasses,
    refetch: refetchTeacherClasses
  } = useQuery({
    queryKey: ["teacherClasses", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.error("No user ID available for querying teacher classes");
        return [];
      }
      
      // console.log("Fetching classes for teacher ID:", user.id);
      
      const { data, error } = await supabase.rpc('get_teacher_classes', {
        p_teacher_id: user.id
      });

      if (error) {
        console.error("Error fetching teacher classes:", error);
        throw error;
      }
      
      // console.log("Fetched teacher classes:", data);
      return data?.map(cls => ({
        id: cls.id,
        name: cls.name,
        description: cls.description,
        startDate: cls.start_date,
        studentsCount: cls.students_count || 0
      })) || [];
    },
    enabled: !!user?.id,
    staleTime: 60000,
    gcTime: 1000 * 60 * 10,
  });

  return {
    classes,
    teacherClasses,
    studentCount,
    lessons,
    allStudents,
    isLoading: isLoadingClasses || isLoadingLessons || isLoadingStudentCount || isLoadingAllStudents || isLoadingTeacherClasses,
    error: classesError || lessonsError,
    refetchClasses,
    refetchLessons,
    refetchAllStudents,
    refetchTeacherClasses
  };
};
