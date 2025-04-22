
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

export const useAdminData = () => {
  const { user } = useAuth();

  const {
    data: students,
    isLoading: isLoadingStudents,
    error: studentsError,
    refetch: refetchStudents
  } = useQuery({
    queryKey: ["adminStudents"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_get_students_data", {});
      if (error) throw error;
      return data;
    },
    enabled: user?.role === "admin"
  });

  const {
    data: teachers,
    isLoading: isLoadingTeachers,
    error: teachersError,
    refetch: refetchTeachers
  } = useQuery({
    queryKey: ["adminTeachers"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_get_teachers", {});
      if (error) throw error;
      return data;
    },
    enabled: user?.role === "admin"
  });

  return {
    students,
    teachers,
    isLoading: isLoadingStudents || isLoadingTeachers,
    error: studentsError || teachersError,
    refetchStudents,
    refetchTeachers
  };
};
