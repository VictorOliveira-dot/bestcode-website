
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Lesson, LessonProgress } from "../types/lesson";
import { Notification } from "../types/notification";

export function useStudentDashboard() {
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

  // Calculate student stats
  const getStudentStats = () => {
    const completedLessons = lessonProgress.filter(progress => progress.status === 'completed').length;
    const inProgressLessons = lessonProgress.filter(progress => progress.status === 'in_progress').length;
    const availableLessons = lessons.filter(lesson => 
      lesson.visibility === 'all' || lesson.class === studentClass
    ).length;
    
    // Calculate overall progress percentage
    const overallProgress = availableLessons > 0 
      ? Math.round((completedLessons / availableLessons) * 100) 
      : 0;

    return {
      completedLessons,
      inProgressLessons,
      availableLessons,
      overallProgress
    };
  };

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

  return {
    lessons,
    lessonProgress,
    notifications,
    studentClass,
    updateLessonProgress,
    handleMarkNotificationAsRead,
    stats: getStudentStats()
  };
}
