
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Components
import DashboardHeader from "@/components/teacher/DashboardHeader";
import DashboardCards from "@/components/teacher/DashboardCards";
import DashboardContent from "@/components/teacher/DashboardContent";
import AddLessonForm from "@/components/teacher/AddLessonForm";

// Types
import { Lesson, NewLesson } from "@/components/student/types/lesson";

interface Class {
  id: string;
  name: string;
}

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("lessons");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [availableClasses, setAvailableClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [studentCount, setStudentCount] = useState(0);

  // Fetch data from Supabase when component mounts
  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching teacher data for user ID:", user.id);
        
        // Fetch classes - Usando a nova política de segurança
        const { data: classesData, error: classesError } = await supabase
          .from('classes')
          .select('id, name')
          .eq('teacher_id', user.id);
          
        if (classesError) {
          console.error("Error fetching classes:", classesError);
          throw classesError;
        }
        
        console.log("Classes fetched:", classesData?.length || 0);
        
        if (classesData && classesData.length > 0) {
          setAvailableClasses(classesData);
          
          // Fetch lessons
          const { data: lessonsData, error: lessonsError } = await supabase
            .from('lessons')
            .select(`
              id,
              title,
              description,
              youtube_url,
              date,
              class_id,
              visibility,
              classes(name)
            `)
            .in('class_id', classesData.map(c => c.id));
          
          if (lessonsError) {
            console.error("Error fetching lessons:", lessonsError);
            throw lessonsError;
          }
          
          if (lessonsData) {
            console.log("Lessons fetched:", lessonsData.length);
            
            const formattedLessons: Lesson[] = lessonsData.map(lesson => ({
              id: lesson.id,
              title: lesson.title,
              description: lesson.description,
              youtubeUrl: lesson.youtube_url,
              date: lesson.date,
              class: lesson.classes?.name || 'Sem turma',
              class_id: lesson.class_id || '',
              visibility: lesson.visibility === 'all' ? 'all' : 'class_only'
            }));
            
            setLessons(formattedLessons);
          }
          
          // Count students enrolled in teacher's classes
          let totalStudents = 0;
          for (const cls of classesData) {
            const { count, error: countError } = await supabase
              .from('enrollments')
              .select('id', { count: 'exact', head: true })
              .eq('class_id', cls.id);
              
            if (!countError && count !== null) {
              totalStudents += count;
            }
          }
          
          setStudentCount(totalStudents);
        } else {
          console.log("No classes found for this teacher");
          setAvailableClasses([]);
          setLessons([]);
        }
      } catch (error: any) {
        console.error("Error fetching teacher data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: error.message || "Ocorreu um erro ao carregar os dados.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Redirect if not authenticated or not a teacher
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'teacher') {
    return <Navigate to="/student/dashboard" />;
  }

  const handleAddLesson = async (newLesson: NewLesson) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Find class name for display
      const classObj = availableClasses.find(c => c.id === newLesson.class_id);
      
      // Insert lesson into the database
      const { data, error } = await supabase
        .from('lessons')
        .insert([{
          title: newLesson.title,
          description: newLesson.description,
          youtube_url: newLesson.youtubeUrl,
          date: newLesson.date,
          class_id: newLesson.class_id,
          visibility: newLesson.visibility
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Add the new lesson to our local state
        const newLessonWithId: Lesson = {
          id: data.id,
          title: data.title,
          description: data.description,
          youtubeUrl: data.youtube_url,
          date: data.date,
          class: classObj?.name || 'Sem turma',
          class_id: data.class_id,
          visibility: data.visibility === 'all' ? 'all' : 'class_only'
        };
        
        setLessons([...lessons, newLessonWithId]);
        setIsAddLessonOpen(false);
        
        toast({
          title: "Aula adicionada",
          description: "Aula foi adicionada com sucesso."
        });
      }
    } catch (error: any) {
      console.error("Error adding lesson:", error);
      toast({
        title: "Erro ao adicionar aula",
        description: error.message || "Ocorreu um erro ao adicionar a aula.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLesson = async (id: string) => {
    setIsLoading(true);
    try {
      // Delete lesson from the database
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove lesson from local state
      const updatedLessons = lessons.filter(lesson => lesson.id !== id);
      setLessons(updatedLessons);
      
      toast({
        title: "Aula removida",
        description: "Aula foi removida com sucesso."
      });
    } catch (error: any) {
      console.error("Error deleting lesson:", error);
      toast({
        title: "Erro ao remover aula",
        description: error.message || "Ocorreu um erro ao remover a aula.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

        <DashboardContent 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lessons={lessons}
          availableClasses={availableClasses.map(c => c.name)}
          setIsAddLessonOpen={setIsAddLessonOpen}
          handleDeleteLesson={handleDeleteLesson}
          isLoading={isLoading}
        />
      </main>

      <AddLessonForm 
        isOpen={isAddLessonOpen}
        onOpenChange={setIsAddLessonOpen}
        onAddLesson={handleAddLesson}
        availableClasses={availableClasses.map(c => c.id)}
      />
    </div>
  );
};

export default TeacherDashboard;
