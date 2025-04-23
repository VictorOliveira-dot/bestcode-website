
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

export const useAdminData = () => {
  const { user } = useAuth();

  const {
    data: dashboardStats,
    isLoading: isLoadingStats,
    error: statsError
  } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('admin_get_dashboard_stats');
      
      if (error) throw error;
      return data;
    },
    enabled: user?.role === "admin"
  });

  const {
    data: students,
    isLoading: isLoadingStudents,
    error: studentsError,
    refetch: refetchStudents
  } = useQuery({
    queryKey: ["adminStudents"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('admin_get_students_data');
      
      if (error) throw error;
      return data || [];
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
      const { data, error } = await supabase.rpc('admin_get_teachers');
      
      if (error) throw error;
      return data || [];
    },
    enabled: user?.role === "admin"
  });

  return {
    dashboardStats: dashboardStats || {},
    students: students || [],
    teachers: teachers || [],
    isLoading: isLoadingStudents || isLoadingTeachers || isLoadingStats,
    error: studentsError || teachersError || statsError,
    refetchStudents,
    refetchTeachers
  };
};
