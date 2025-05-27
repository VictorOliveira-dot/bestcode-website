
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
        startDate: cls.start_date,
        studentsCount: 0,
        teacher_id: cls.teacher_id,
        teacher_name: cls.users ? cls.users.name : 'N/A'
      })) || [];
    },
    staleTime: 60000, // Aumentando para 1 minuto
    gcTime: 1000 * 60 * 10, // Aumentando cache para 10 minutos
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
    staleTime: 60000,
    gcTime: 1000 * 60 * 10,
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
        .eq('is_active', true) // Apenas alunos ativos para melhor performance
        .order('name');

      if (error) {
        console.error("Error fetching all students:", error);
        throw error;
      }
      
      console.log("Fetched all students:", data);
      return data || [];
    },
    staleTime: 60000,
    gcTime: 1000 * 60 * 10,
  });

  // Query otimizada para as turmas do professor
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
      
      console.log("Fetching classes for teacher ID:", user.id);
      
      const { data, error } = await supabase.rpc('get_teacher_classes', {
        p_teacher_id: user.id
      });

      if (error) {
        console.error("Error fetching teacher classes:", error);
        throw error;
      }
      
      console.log("Fetched teacher classes:", data);
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
