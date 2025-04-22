
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

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader userName={user.name} />

      <main className="container-custom py-4 md:py-8 px-2 md:px-0">
        <DashboardCards 
          classesCount={classes?.length || 0}
          lessonsCount={lessons?.length || 0}
          studentsCount={studentCount || 0}
          onAddLessonClick={() => setIsAddLessonOpen(true)}
          onChangeTab={setActiveTab}
        />

        <DashboardContent 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lessons={lessons || []}
          availableClasses={classes || []}
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
        availableClasses={classes || []}
      />
    </div>
  );
};

export default TeacherDashboard;
