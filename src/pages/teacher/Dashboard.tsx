
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import DashboardHeader from "@/components/teacher/DashboardHeader";
import DashboardCards from "@/components/teacher/DashboardCards";
import DashboardContent from "@/components/teacher/DashboardContent";
import AddLessonForm from "@/components/teacher/AddLessonForm";
import { useTeacherData } from "@/hooks/teacher/useTeacherData";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    teacherClasses,
    studentCount, 
    lessons, 
    isLoading,
    refetchLessons,
    refetchClasses
  } = useTeacherData();

  console.log("Dashboard - Raw lessons data:", lessons);
  console.log("Dashboard - Teacher classes:", teacherClasses);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'teacher') {
    return <Navigate to="/student/dashboard" />;
  }

  // Mapear as aulas para o formato esperado pelo componente
  const formattedLessons: Lesson[] = Array.isArray(lessons) ? lessons.map(lesson => {
    console.log("Formatting lesson:", lesson);
    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      youtubeUrl: lesson.youtube_url,
      date: lesson.date,
      class: lesson.class_name || 'Turma não encontrada',
      class_id: lesson.class_id,
      visibility: lesson.visibility as 'all' | 'class_only'
    };
  }) : [];

  console.log("Dashboard - Formatted lessons:", formattedLessons);

  // Usar teacherClasses em vez de classes para o formulário de aulas
  const formattedClasses: Class[] = Array.isArray(teacherClasses) ? teacherClasses.map(cls => ({
    id: cls.id,
    name: cls.name
  })) : [];
  
  console.log("Dashboard - Formatted classes:", formattedClasses);
  
  const studentCountValue = typeof studentCount === 'number' ? studentCount : 0;

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) {
        console.error('Error deleting lesson:', error);
        toast({
          title: "Erro ao excluir aula",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Aula excluída",
        description: "A aula foi excluída com sucesso.",
      });

      await refetchLessons();
    } catch (error: any) {
      console.error('Error deleting lesson:', error);
      toast({
        title: "Erro ao excluir aula",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  };

  const handleEditLesson = async (lessonId: string, updatedLesson: any) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .update({
          title: updatedLesson.title,
          description: updatedLesson.description,
          youtube_url: updatedLesson.youtubeUrl,
          date: updatedLesson.date,
          class_id: updatedLesson.classId,
          visibility: updatedLesson.visibility
        })
        .eq('id', lessonId);

      if (error) {
        console.error('Error updating lesson:', error);
        toast({
          title: "Erro ao atualizar aula",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Aula atualizada",
        description: "A aula foi atualizada com sucesso.",
      });

      await refetchLessons();
    } catch (error: any) {
      console.error('Error updating lesson:', error);
      toast({
        title: "Erro ao atualizar aula",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader userName={user.name} />

      <main className="container-custom py-4 md:py-8 px-2 md:px-0">
        <DashboardCards 
          classesCount={teacherClasses.length}
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
          handleDeleteLesson={handleDeleteLesson}
          handleEditLesson={handleEditLesson}
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
