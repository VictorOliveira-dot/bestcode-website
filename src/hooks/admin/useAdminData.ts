
import { useStudentsTable } from "./useStudentsTable";
import { useTeachers } from "./useTeachers";
import { useCourses } from "./useCourses";
import { useStripeRevenue } from "./useStripeRevenue";
import { useActiveStudentsCount } from "./useActiveStudentsCount";
import { useEnrollmentStats } from "./useEnrollmentStats";
import { useAuth } from "@/contexts/auth";

export function useAdminData() {
  const { user, loading: authLoading } = useAuth();
  const { students, isLoading: studentsLoading, refetch: refetchStudents } = useStudentsTable();
  const { teachers, isLoading: teachersLoading, fetchTeachers } = useTeachers(!authLoading && user?.role === 'admin');
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: payments, totalRevenue, isLoading: paymentsLoading } = useStripeRevenue();
  const { activeStudentsCount, isLoading: countLoading } = useActiveStudentsCount();
  const { enrollmentStats, isLoading: statsLoading } = useEnrollmentStats();
  
  const isLoading = authLoading || studentsLoading || teachersLoading || coursesLoading || countLoading || paymentsLoading || statsLoading;

  return {
    students,
    teachers,
    courses: courses || [],
    payments: payments || [],
    enrollmentStats: enrollmentStats || [],
    activeStudentsCount,
    totalRevenue,
    isLoading,
    refetchStudents,
    refetchTeachers: fetchTeachers
  };
}
