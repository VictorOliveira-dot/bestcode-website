
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import StudentLessonsPanel from "@/components/student/StudentLessonsPanel";
import StudentNotifications from "@/components/student/StudentNotifications";

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

interface LessonProgress {
  lessonId: string;
  watchTimeMinutes: number;
  lastWatched: string | null;
  progress: number;
  status: 'completed' | 'in_progress' | 'not_started';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [studentClass, setStudentClass] = useState("QA-01"); // Default student class
  
  // Fetch lessons from localStorage (in a real app, this would be an API call)
  useEffect(() => {
    const teacherLessons = localStorage.getItem('teacher_lessons');
    if (teacherLessons) {
      setLessons(JSON.parse(teacherLessons));
    }

    // Get stored progress from localStorage
    const storedProgress = localStorage.getItem('student_progress');
    if (storedProgress) {
      setLessonProgress(JSON.parse(storedProgress));
    } else {
      // Initialize with default progress
      const defaultProgress: LessonProgress[] = [];
      setLessonProgress(defaultProgress);
      localStorage.setItem('student_progress', JSON.stringify(defaultProgress));
    }

    // Sample notifications (in a real app, these would come from an API)
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        title: 'Nova aula disponível',
        message: 'Foi adicionada uma nova aula de Testes de Regressão para sua turma.',
        date: '2023-08-01',
        read: false
      },
      {
        id: '2',
        title: 'Lembrete de atividade',
        message: 'Não se esqueça de completar a atividade prática de Cypress até o final da semana.',
        date: '2023-07-28',
        read: true
      },
      {
        id: '3',
        title: 'Feedback do professor',
        message: 'Seu último teste recebeu feedback positivo. Continue o bom trabalho!',
        date: '2023-07-25',
        read: true
      }
    ];

    // Get stored notifications from localStorage
    const storedNotifications = localStorage.getItem('student_notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      // Initialize with sample notifications
      setNotifications(sampleNotifications);
      localStorage.setItem('student_notifications', JSON.stringify(sampleNotifications));
    }
  }, []);

  // Redirect if not authenticated or not a student
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'student') {
    return <Navigate to="/teacher/dashboard" />;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso."
    });
  };

  // Calculate student stats
  const completedLessons = lessonProgress.filter(progress => progress.status === 'completed').length;
  const inProgressLessons = lessonProgress.filter(progress => progress.status === 'in_progress').length;
  const availableLessons = lessons.filter(lesson => 
    lesson.visibility === 'all' || lesson.class === studentClass
  ).length;
  
  // Calculate overall progress percentage
  const overallProgress = availableLessons > 0 
    ? Math.round((completedLessons / availableLessons) * 100) 
    : 0;

  const updateLessonProgress = (lessonId: string, watchTimeMinutes: number, progress: number) => {
    // Find existing progress or create new
    const existingProgressIndex = lessonProgress.findIndex(p => p.lessonId === lessonId);
    const now = new Date().toISOString();
    
    if (existingProgressIndex >= 0) {
      // Update existing progress
      const updatedProgress = [...lessonProgress];
      updatedProgress[existingProgressIndex] = {
        ...updatedProgress[existingProgressIndex],
        watchTimeMinutes,
        progress,
        lastWatched: now,
        status: progress >= 100 ? 'completed' : 'in_progress'
      };
      
      setLessonProgress(updatedProgress);
      localStorage.setItem('student_progress', JSON.stringify(updatedProgress));
    } else {
      // Create new progress entry
      const newProgressEntry: LessonProgress = {
        lessonId,
        watchTimeMinutes,
        progress,
        lastWatched: now,
        status: progress >= 100 ? 'completed' : 'in_progress'
      };
      
      const updatedProgress = [...lessonProgress, newProgressEntry];
      setLessonProgress(updatedProgress);
      localStorage.setItem('student_progress', JSON.stringify(updatedProgress));
    }
  };

  const handleMarkNotificationAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem('student_notifications', JSON.stringify(updatedNotifications));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow py-4">
        <div className="container-custom flex justify-between items-center">
          <h1 className="text-2xl font-bold text-bestcode-800">Painel do Aluno</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Olá, {user.name}</span>
            <Button variant="outline" onClick={handleLogout}>Sair</Button>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Meus Cursos</CardTitle>
              <CardDescription>Cursos em andamento</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">2 cursos</p>
              <Button className="mt-4 w-full bg-bestcode-600 hover:bg-bestcode-700">Ver Cursos</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Aulas</CardTitle>
              <CardDescription>Aulas agendadas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{inProgressLessons} em andamento</p>
              <Button className="mt-4 w-full bg-bestcode-600 hover:bg-bestcode-700">Ver Agenda</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progresso</CardTitle>
              <CardDescription>Seu progresso geral</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{overallProgress}% completo</p>
              <p className="text-sm text-gray-600 mb-2">
                {completedLessons} de {availableLessons} aulas concluídas
              </p>
              <Button className="mt-2 w-full bg-bestcode-600 hover:bg-bestcode-700">Ver Detalhes</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <StudentLessonsPanel
              lessons={lessons}
              studentClass={studentClass}
              lessonProgress={lessonProgress}
              updateLessonProgress={updateLessonProgress}
            />
          </div>
          <div>
            <StudentNotifications 
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationAsRead}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
