
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import DashboardHeader from "@/components/teacher/DashboardHeader";
import DashboardCards from "@/components/teacher/DashboardCards";
import DashboardContent from "@/components/teacher/DashboardContent";
import AddLessonForm from "@/components/teacher/AddLessonForm";
import { useTeacherData } from "@/hooks/teacher/useTeacherData";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("lessons");
  
  const { 
    classes, 
    studentCount, 
    lessons, 
    isLoading,
    refetchLessons,
    refetchClasses
  } = useTeacherData();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'teacher') {
    return <Navigate to="/student/dashboard" />;
  }

  // Garantir que os dados são do tipo esperado
  const formattedLessons = Array.isArray(lessons) ? lessons.map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    youtubeUrl: lesson.youtube_url,
    date: lesson.date,
    class: lesson.class_name,
    class_id: lesson.class_id,
    visibility: lesson.visibility
  })) : [];

  const formattedClasses = Array.isArray(classes) ? classes : [];
  const studentCountValue = typeof studentCount === 'number' ? studentCount : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader userName={user.name} />

      <main className="container-custom py-4 md:py-8 px-2 md:px-0">
        <DashboardCards 
          classesCount={formattedClasses.length}
          lessonsCount={formattedLessons.length}
          studentsCount={studentCountValue}
          onAddLessonClick={() => setIsAddLessonOpen(true)}
          onChangeTab={setActiveTab}
        />

        <DashboardContent 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lessons={formattedLessons}
          availableClasses={formattedClasses}
          setIsAddLessonOpen={setIsAddLessonOpen}
          handleDeleteLesson={async () => { await refetchLessons(); }}
          handleEditLesson={async () => { await refetchLessons(); }}
          isLoading={isLoading}
        />
      </main>

      <AddLessonForm 
        isOpen={isAddLessonOpen}
        onOpenChange={setIsAddLessonOpen}
        onAddLesson={async () => { 
          await refetchLessons();
          await refetchClasses();
        }}
        availableClasses={formattedClasses}
      />
    </div>
  );
};

export default TeacherDashboard;
