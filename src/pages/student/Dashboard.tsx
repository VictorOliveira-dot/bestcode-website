
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import StudentLessonsPanel from "@/components/student/StudentLessonsPanel";
import StudentNotifications from "@/components/student/StudentNotifications";
import DashboardHeader from "@/components/student/DashboardHeader";
import DashboardStatsCards from "@/components/student/DashboardStatsCards";
import { useStudentData } from "@/hooks/student/useStudentData";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { 
    lessons,
    progress,
    notifications,
    enrollments,
    updateProgress,
    isLoading
  } = useStudentData();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'student') {
    return <Navigate to="/teacher/dashboard" />;
  }

  const stats = {
    inProgressLessons: progress?.filter(p => p.status === "in_progress").length || 0,
    completedLessons: progress?.filter(p => p.status === "completed").length || 0,
    overallProgress: progress?.length 
      ? Math.round((progress.reduce((acc, p) => acc + p.progress, 0) / (progress.length * 100)) * 100)
      : 0,
    availableLessons: lessons?.length || 0,
  };

  const studentClass = enrollments?.[0]?.classes?.name || "";

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader userName={user.name} />

      <main className="container-custom py-8">
        <DashboardStatsCards {...stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <StudentLessonsPanel
              lessons={lessons || []}
              studentClass={studentClass}
              lessonProgress={progress || []}
              updateLessonProgress={updateProgress}
              isLoading={isLoading}
            />
          </div>
          <div>
            <StudentNotifications 
              notifications={notifications || []}
              onMarkAsRead={() => {}} // Implementar mais tarde
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
