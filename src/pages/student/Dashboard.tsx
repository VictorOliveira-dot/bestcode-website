import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import StudentLessonsPanel from "@/components/student/StudentLessonsPanel";
import StudentNotifications from "@/components/student/StudentNotifications";
import DashboardHeader from "@/components/student/DashboardHeader";
import DashboardStatsCards from "@/components/student/DashboardStatsCards";
import { useStudentDashboard } from "@/components/student/hooks/useStudentDashboard";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { 
    lessons,
    lessonProgress,
    notifications,
    studentClass,
    updateLessonProgress,
    handleMarkNotificationAsRead,
    stats
  } = useStudentDashboard();
  
  // Redirect if not authenticated or not a student
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'student') {
    return <Navigate to="/teacher/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader userName={user.name} />

      <main className="container-custom py-8">
        <DashboardStatsCards
          inProgressLessons={stats.inProgressLessons}
          overallProgress={stats.overallProgress}
          completedLessons={stats.completedLessons}
          availableLessons={stats.availableLessons}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <StudentLessonsPanel
              lessons={lessons}
              studentClass={studentClass}
              lessonProgress={lessonProgress}
              updateLessonProgress={updateLessonProgress}
            />
          </div>
          <div>
            <StudentNotifications 
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationAsRead}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
