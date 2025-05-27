
import { useStudentsTable } from "./useStudentsTable";
import { useTeachers } from "./useTeachers";
import { useCourses } from "./useCourses";
import { useStripeRevenue } from "./useStripeRevenue";
import { useActiveStudentsCount } from "./useActiveStudentsCount";
import { useEnrollmentStats } from "./useEnrollmentStats";

export function useAdminData() {
  const { students, isLoading: studentsLoading, refetch: refetchStudents } = useStudentsTable();
  const { teachers, isLoading: teachersLoading, fetchTeachers } = useTeachers();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: payments, totalRevenue, isLoading: paymentsLoading } = useStripeRevenue();
  const { activeStudentsCount, isLoading: countLoading } = useActiveStudentsCount();
  const { enrollmentStats, isLoading: statsLoading } = useEnrollmentStats();
  
  const isLoading = studentsLoading || teachersLoading || coursesLoading || countLoading || paymentsLoading || statsLoading;

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
