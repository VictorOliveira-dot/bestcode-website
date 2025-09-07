import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import DashboardHeader from "@/components/teacher/DashboardHeader";
import DashboardCards from "@/components/teacher/DashboardCards";
import DashboardContent from "@/components/teacher/DashboardContent";
import AddLessonModal from "@/components/teacher/modals/AddLessonModal";
import { useTeacherData } from "@/hooks/teacher/useTeacherData";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveDashboardLayout, ResponsiveDashboardMain } from "@/components/ui/responsive-dashboard";

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

  // Usar teacherClasses em vez de classes para o formulário de aulas
  const formattedClasses: Class[] = Array.isArray(teacherClasses) ? teacherClasses.map(cls => ({
    id: cls.id,
    name: cls.name
  })) : [];
  
  const studentCountValue = typeof studentCount === 'number' ? studentCount : 0;

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      const { error } = await supabase.rpc('delete_lesson', {
        p_lesson_id: lessonId,
        p_teacher_id: user.id
      });

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
      const { error } = await supabase.rpc('update_lesson', {
        p_lesson_id: lessonId,
        p_title: updatedLesson.title,
        p_description: updatedLesson.description,
        p_youtube_url: updatedLesson.youtubeUrl,
        p_date: updatedLesson.date,
        p_class_id: updatedLesson.classId,
        p_visibility: updatedLesson.visibility,
        p_teacher_id: user.id
      });

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
    <ResponsiveDashboardLayout>
      <DashboardHeader userName={user.name} />

      <ResponsiveDashboardMain>
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
          notifications={[]}
        />
      </ResponsiveDashboardMain>

      <AddLessonModal 
        isOpen={isAddLessonOpen}
        onOpenChange={setIsAddLessonOpen}
        onAddLesson={async () => { 
          await refetchLessons();
          await refetchClasses();
        }}
        availableClasses={formattedClasses}
      />
    </ResponsiveDashboardLayout>
  );
};

export default TeacherDashboard;
