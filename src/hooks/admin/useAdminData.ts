
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

  const {
    data: courses,
    isLoading: isLoadingCourses,
    error: coursesError,
    refetch: refetchCourses
  } = useQuery({
    queryKey: ["adminCourses"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('admin_get_courses');
      
      if (error) throw error;
      return data || [];
    },
    enabled: user?.role === "admin"
  });

  const {
    data: payments,
    isLoading: isLoadingPayments,
    error: paymentsError,
    refetch: refetchPayments
  } = useQuery({
    queryKey: ["adminPayments"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('admin_get_payments');
      
      if (error) throw error;
      return data || [];
    },
    enabled: user?.role === "admin"
  });

  const {
    data: enrollmentStats,
    isLoading: isLoadingEnrollmentStats,
    error: enrollmentStatsError
  } = useQuery({
    queryKey: ["adminEnrollmentStats"],
    queryFn: async () => {
      // Use current year's start and end dates
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear}-01-01`;
      const endDate = `${currentYear}-12-31`;
      
      const { data, error } = await supabase.rpc('admin_get_enrollment_stats', {
        p_start_date: startDate,
        p_end_date: endDate
      });
      
      if (error) throw error;
      return data || [];
    },
    enabled: user?.role === "admin"
  });

  return {
    dashboardStats: dashboardStats || {},
    students: students || [],
    teachers: teachers || [],
    courses: courses || [],
    payments: payments || [],
    enrollmentStats: enrollmentStats || [],
    isLoading: isLoadingStudents || isLoadingTeachers || 
               isLoadingStats || isLoadingCourses || 
               isLoadingPayments || isLoadingEnrollmentStats,
    error: studentsError || teachersError || statsError || 
           coursesError || paymentsError || enrollmentStatsError,
    refetchStudents,
    refetchTeachers,
    refetchCourses,
    refetchPayments
  };
};

