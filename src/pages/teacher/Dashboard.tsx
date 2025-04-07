
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Components
import DashboardHeader from "@/components/teacher/DashboardHeader";
import DashboardCards from "@/components/teacher/DashboardCards";
import DashboardContent from "@/components/teacher/DashboardContent";
import AddLessonForm from "@/components/teacher/AddLessonForm";
import ClassManagement from "@/components/teacher/ClassManagement";

// Custom hooks and utilities
import { useDashboardData } from "@/hooks/teacher/useDashboardData";
import { addLesson, deleteLesson } from "@/utils/teacher/lessonManager";

// Types
import { NewLesson } from "@/components/student/types/lesson";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("lessons");
  
  const { 
    lessons, 
    setLessons, 
    availableClasses, 
    studentCount, 
    isLoading 
  } = useDashboardData();

  // Redirect if not authenticated or not a teacher
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'teacher') {
    return <Navigate to="/student/dashboard" />;
  }

  const handleAddLesson = async (newLesson: NewLesson) => {
    if (!user) return;
    
    console.log("Adding lesson:", newLesson);
    
    const updatedLessons = await addLesson(
      newLesson,
      user.id,
      availableClasses,
      lessons
    );
    
    setLessons(updatedLessons);
    setIsAddLessonOpen(false);
  };

  const handleDeleteLesson = async (id: string) => {
    const updatedLessons = await deleteLesson(id, lessons);
    setLessons(updatedLessons);
  };

  const renderTabContent = () => {
    if (activeTab === "classes") {
      return (
        <div className="mt-6">
          <ClassManagement />
        </div>
      );
    }
    
    return (
      <DashboardContent 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lessons={lessons}
        availableClasses={availableClasses.map(c => c.name)}
        setIsAddLessonOpen={setIsAddLessonOpen}
        handleDeleteLesson={handleDeleteLesson}
        isLoading={isLoading}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader userName={user.name} />

      <main className="container-custom py-4 md:py-8 px-2 md:px-0">
        <DashboardCards 
          classesCount={availableClasses.length}
          lessonsCount={lessons.length}
          studentsCount={studentCount}
          onAddLessonClick={() => setIsAddLessonOpen(true)}
          onChangeTab={setActiveTab}
        />

        {renderTabContent()}
      </main>

      <AddLessonForm 
        isOpen={isAddLessonOpen}
        onOpenChange={setIsAddLessonOpen}
        onAddLesson={handleAddLesson}
        availableClasses={availableClasses}
      />
    </div>
  );
};

export default TeacherDashboard;
