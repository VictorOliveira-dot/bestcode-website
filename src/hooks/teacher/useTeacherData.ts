
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
      console.log("Fetching all classes");
      
      const { data, error } = await supabase
        .from('classes')
        .select(`
          id,
          name,
          description,
          start_date,
          teacher_id,
          users!classes_teacher_id_fkey(name)
        `)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error("Error fetching all classes:", error);
        throw error;
      }
      
      console.log("Fetched all classes:", data);
      return data?.map(cls => ({
        id: cls.id,
        name: cls.name,
        description: cls.description,
        start_date: cls.start_date,
        teacher_id: cls.teacher_id,
        teacher_name: cls.users?.name || 'N/A'
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
      console.log("Fetching total student count");
      
      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      if (error) {
        console.error("Error fetching total student count:", error);
        throw error;
      }
      
      console.log("Fetched total student count:", count);
      return count || 0;
    },
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

  const {
    data: allStudents = [],
    isLoading: isLoadingAllStudents,
    refetch: refetchAllStudents
  } = useQuery({
    queryKey: ["allStudents"],
    queryFn: async () => {
      console.log("Fetching all students");
      
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          created_at,
          is_active
        `)
        .eq('role', 'student')
        .order('name');

      if (error) {
        console.error("Error fetching all students:", error);
        throw error;
      }
      
      console.log("Fetched all students:", data);
      return data || [];
    },
    staleTime: 30000,
    gcTime: 1000 * 60 * 5,
  });

  return {
    classes,
    studentCount,
    lessons,
    allStudents,
    isLoading: isLoadingClasses || isLoadingLessons || isLoadingStudentCount || isLoadingAllStudents,
    error: classesError || lessonsError,
    refetchClasses,
    refetchLessons,
    refetchAllStudents
  };
};
