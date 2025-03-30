
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

// Components
import DashboardHeader from "@/components/teacher/DashboardHeader";
import DashboardCards from "@/components/teacher/DashboardCards";
import DashboardContent from "@/components/teacher/DashboardContent";
import AddLessonForm from "@/components/teacher/AddLessonForm";

// Types
interface Lesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  date: string;
  class: string;
  visibility: 'all' | 'class_only';
}

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("lessons");
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const savedLessons = localStorage.getItem('teacher_lessons');
    return savedLessons ? JSON.parse(savedLessons) : [
      {
        id: '1',
        title: 'Introdução ao Teste de API',
        description: 'Aula básica sobre testes de API e suas ferramentas',
        youtubeUrl: 'https://youtube.com/watch?v=example1',
        date: '2023-07-15',
        class: 'QA-01',
        visibility: 'class_only'
      },
      {
        id: '2',
        title: 'Testes de Regressão',
        description: 'Métodos avançados de testes de regressão',
        youtubeUrl: 'https://youtube.com/watch?v=example2',
        date: '2023-07-14',
        class: 'QA-02',
        visibility: 'all'
      },
      {
        id: '3',
        title: 'Automação com Cypress',
        description: 'Como utilizar o Cypress para automação de testes',
        youtubeUrl: 'https://youtube.com/watch?v=example3',
        date: '2023-07-13',
        class: 'QA-01',
        visibility: 'class_only'
      }
    ];
  });

  // Classes disponíveis (agora viriam do componente de ClassManagement)
  const availableClasses = ['QA-01', 'QA-02', 'DEV-01', 'DEV-02'];

  // Redirect if not authenticated or not a teacher
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'teacher') {
    return <Navigate to="/student/dashboard" />;
  }

  const handleAddLesson = (newLesson: Omit<Lesson, 'id'>) => {
    const newLessonWithId = {
      ...newLesson,
      id: Date.now().toString()
    };

    const updatedLessons = [...lessons, newLessonWithId];
    setLessons(updatedLessons);
    
    // Salvar no localStorage
    localStorage.setItem('teacher_lessons', JSON.stringify(updatedLessons));
    
    setIsAddLessonOpen(false);
    
    toast({
      title: "Aula adicionada",
      description: "Aula foi adicionada com sucesso."
    });
  };

  const handleDeleteLesson = (id: string) => {
    const updatedLessons = lessons.filter(lesson => lesson.id !== id);
    setLessons(updatedLessons);
    localStorage.setItem('teacher_lessons', JSON.stringify(updatedLessons));
    
    toast({
      title: "Aula removida",
      description: "Aula foi removida com sucesso."
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader userName={user.name} />

      <main className="container-custom py-8">
        <DashboardCards 
          classesCount={availableClasses.length}
          lessonsCount={lessons.length}
          studentsCount={28} // This is hardcoded in the original component
          onAddLessonClick={() => setIsAddLessonOpen(true)}
          onChangeTab={setActiveTab}
        />

        <DashboardContent 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lessons={lessons}
          availableClasses={availableClasses}
          setIsAddLessonOpen={setIsAddLessonOpen}
          handleDeleteLesson={handleDeleteLesson}
        />
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
