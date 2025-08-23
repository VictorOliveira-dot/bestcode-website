
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import StudentLessonsPanel from "@/components/student/StudentLessonsPanel";
import StudentNotifications from "@/components/student/StudentNotifications";
import StudentDocumentation from "@/components/student/StudentDocumentation";
import DashboardHeader from "@/components/student/DashboardHeader";
import DashboardStatsCards from "@/components/student/DashboardStatsCards";
import { useStudentData } from "@/hooks/student/useStudentData";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [showDocumentation, setShowDocumentation] = useState(false);
  
  const { 
    lessons,
    notifications,
    enrollments,
    markNotificationAsRead,
    isLoading
  } = useStudentData();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'student') {
    return <Navigate to="/teacher/dashboard" />;
  }

  // console.log('📊 Dashboard data:', {
  //   lessons: lessons?.length || 0,
  //   progress: progress?.length || 0,
  //   enrollments: enrollments?.length || 0,
  //   isLoading,
  //   rawLessons: lessons,
  //   rawEnrollments: enrollments
  // });

  // Get student class from enrollments data
  const studentClass = enrollments && enrollments.length > 0 
    ? enrollments[0].class_name
    : null;

  // console.log('🎓 Student class determined:', studentClass);

  // Se não temos turma, não podemos mostrar aulas
  if (!studentClass && !isLoading) {
    console.warn('⚠️ No student class found - student may not be enrolled');
  }

  const formattedLessons = Array.isArray(lessons) ? lessons.map(lesson => {
    // console.log('🔍 Processing lesson:', {
    //   id: lesson.id,
    //   title: lesson.title,
    //   class_name: lesson.class_name,
    //   visibility: lesson.visibility
    // });
    
    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      youtubeUrl: lesson.youtube_url,
      date: lesson.date,
      class: lesson.class_name, // Usando class_name do banco
      class_id: lesson.class_id,
      visibility: lesson.visibility as 'all' | 'class_only' | 'complementary'
    };
  }) : [];

  // console.log('✅ Formatted lessons:', formattedLessons.length, formattedLessons);

  const formattedNotifications = Array.isArray(notifications) ? notifications.map(n => ({
    id: n.id,
    title: n.title,
    message: n.message,
    date: n.date,
    read: n.read
  })) : [];

  const stats = {
    availableLessons: formattedLessons.length || 0,
    enrollmentsCount: enrollments?.length || 0,
    inProgressLessons: 0, // Removido sistema de progresso
    completedLessons: 0, // Removido sistema de progresso
    overallProgress: 0 // Removido sistema de progresso
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex justify-between items-center p-3 sm:p-4">
        <DashboardHeader userName={user.name} />
      </div>

      <main className="container-custom py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <DashboardStatsCards {...stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            {studentClass ? (
              <StudentLessonsPanel
                lessons={formattedLessons}
                studentClass={studentClass}
                isLoading={isLoading}
              />
            ) : (
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Minhas Aulas</h2>
                <div className="text-center py-8 text-gray-500">
                  {isLoading ? 'Carregando...' : 'Você não está matriculado em nenhuma turma.'}
                </div>
              </div>
            )}
          </div>
          <div>
            <StudentNotifications 
              notifications={formattedNotifications}
              onMarkAsRead={markNotificationAsRead}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
