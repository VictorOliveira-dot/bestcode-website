
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import DashboardHeader from "@/components/teacher/DashboardHeader";
import DashboardCards from "@/components/teacher/DashboardCards";
import DashboardContent from "@/components/teacher/DashboardContent";
import AddLessonForm from "@/components/teacher/AddLessonForm";
import { useTeacherData } from "@/hooks/teacher/useTeacherData";

interface Lesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  date: string;
  class: string;
  class_id: string;
  visibility: 'all' | 'class_only';
}

interface Class {
  id: string;
  name: string;
}

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

  // Ensure we have the right data types
  const formattedLessons: Lesson[] = Array.isArray(lessons) ? lessons.map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    youtubeUrl: lesson.youtube_url,
    date: lesson.date,
    class: lesson.class_name,
    class_id: lesson.class_id,
    visibility: lesson.visibility as 'all' | 'class_only'
  })) : [];

  const formattedClasses: Class[] = Array.isArray(classes) ? classes.map(cls => ({
    id: cls.id,
    name: cls.name
  })) : [];
  
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
