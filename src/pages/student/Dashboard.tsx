import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import StudentLessonsPanel from "@/components/student/StudentLessonsPanel";
import StudentNotifications from "@/components/student/StudentNotifications";
import DashboardHeader from "@/components/student/DashboardHeader";
import DashboardStatsCards from "@/components/student/DashboardStatsCards";
import { useStudentData } from "@/hooks/student/useStudentData";
import { Lesson } from "@/components/student/types/lesson";
import { Enrollment, LessonData, ProgressData } from "@/components/student/types";

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

  const formattedLessons = Array.isArray(lessons) ? lessons.map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    youtubeUrl: lesson.youtubeUrl,  // Now using consistent property name
    date: lesson.date,
    class: lesson.class,
    class_id: lesson.class_id,
    visibility: lesson.visibility as 'all' | 'class_only'
  })) : [];

  const formattedProgress = Array.isArray(progress) ? progress.map(p => ({
    lessonId: p.lesson_id,
    watchTimeMinutes: p.watch_time_minutes,
    progress: p.progress,
    status: p.status as 'completed' | 'in_progress' | 'not_started',
    lastWatched: p.last_watched
  })) : [];

  const formattedNotifications = Array.isArray(notifications) ? notifications : [];

  const stats = {
    inProgressLessons: formattedProgress.filter(p => p.status === "in_progress").length || 0,
    completedLessons: formattedProgress.filter(p => p.status === "completed").length || 0,
    overallProgress: formattedProgress.length 
      ? Math.round((formattedProgress.reduce((acc, p) => acc + p.progress, 0) / (formattedProgress.length * 100)) * 100)
      : 0,
    availableLessons: formattedLessons.length || 0,
  };

  // Correctly access the student class name from the transformed enrollment data
  const studentClass = enrollments && enrollments.length > 0 
    ? enrollments[0].name
    : "";

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader userName={user.name} />

      <main className="container-custom py-8">
        <DashboardStatsCards {...stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <StudentLessonsPanel
              lessons={formattedLessons}
              studentClass={studentClass}
              lessonProgress={formattedProgress}
              updateLessonProgress={updateProgress}
              isLoading={isLoading}
            />
          </div>
          <div>
            <StudentNotifications 
              notifications={formattedNotifications}
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
