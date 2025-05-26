
import { useStudentsTable } from "./useStudentsTable";
import { useTeachers } from "./useTeachers";
import { useCourses } from "./useCourses";
import { useRevenue } from "./useRevenue";
import { useActiveStudentsCount } from "./useActiveStudentsCount";

export function useAdminData() {
  const { students, isLoading: studentsLoading, refetch: refetchStudents } = useStudentsTable();
  const { teachers, isLoading: teachersLoading, fetchTeachers } = useTeachers();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: payments } = useRevenue();
  const { activeStudentsCount, isLoading: countLoading } = useActiveStudentsCount();

  const enrollmentStats = [];
  
  const isLoading = studentsLoading || teachersLoading || coursesLoading || countLoading;

  return {
    students,
    teachers,
    courses: courses || [],
    payments: payments || [],
    enrollmentStats,
    activeStudentsCount,
    isLoading,
    refetchStudents,
    refetchTeachers: fetchTeachers
  };
}
