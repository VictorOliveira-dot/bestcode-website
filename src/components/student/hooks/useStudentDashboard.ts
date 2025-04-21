
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";
import { Lesson, LessonProgress } from "../types/lesson";
import { Notification } from "../types/notification";

export const useStudentDashboard = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [studentClass, setStudentClass] = useState<string>("");
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockClassName = "Web Development";
        const mockLessons: Lesson[] = [
          {
            id: "1",
            title: "Introdução ao HTML",
            description: "Aprenda os fundamentos do HTML",
            youtubeUrl: "https://youtube.com/watch?v=demo1",
            date: "2023-04-15",
            class: mockClassName,
            class_id: "class1",
            visibility: "all"
          },
          {
            id: "2",
            title: "CSS Básico",
            description: "Estilizando páginas web com CSS",
            youtubeUrl: "https://youtube.com/watch?v=demo2",
            date: "2023-04-22",
            class: mockClassName,
            class_id: "class1",
            visibility: "all"
          },
          {
            id: "3",
            title: "JavaScript Fundamentos",
            description: "Programação com JavaScript",
            youtubeUrl: "https://youtube.com/watch?v=demo3",
            date: "2023-05-01",
            class: mockClassName,
            class_id: "class1",
            visibility: "all"
          }
        ];
        
        const mockProgress: LessonProgress[] = [
          {
            lessonId: "1",
            watchTimeMinutes: 25,
            lastWatched: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            progress: 100,
            status: 'completed'
          },
          {
            lessonId: "2",
            watchTimeMinutes: 15,
            lastWatched: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            progress: 45,
            status: 'in_progress'
          },
          {
            lessonId: "3",
            watchTimeMinutes: 0,
            lastWatched: null,
            progress: 0,
            status: 'not_started'
          }
        ];
        
        const mockNotifications: Notification[] = [
          {
            id: "1",
            title: "Nova aula disponível",
            message: "A aula sobre JavaScript Fundamentos já está disponível",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            read: false
          },
          {
            id: "2",
            title: "Lembrete de atividade",
            message: "Não esqueça de enviar o exercício de CSS até amanhã",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            read: true
          }
        ];

        setStudentClass(mockClassName);
        setLessons(mockLessons);
        setLessonProgress(mockProgress);
        setNotifications(mockNotifications);
      } catch (err: any) {
        console.error("Error fetching student dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const stats = {
    inProgressLessons: lessonProgress.filter(l => l.status === "in_progress").length,
    completedLessons: lessonProgress.filter(l => l.status === "completed").length,
    overallProgress: Math.round(
      (lessonProgress.reduce((acc, lesson) => acc + lesson.progress, 0) / 
      (lessonProgress.length * 100 || 1)) * 100
    ),
    availableLessons: lessons.length,
  };

  const updateLessonProgress = async (lessonId: string, watchTimeMinutes: number, progress: number) => {
    try {
      const newStatus = progress >= 100 ? "completed" : progress > 0 ? "in_progress" : "not_started";
      
      // Update local state
      setLessonProgress(prev => prev.map(item => {
        if (item.lessonId === lessonId) {
          return {
            ...item,
            watchTimeMinutes,
            progress,
            status: newStatus as 'completed' | 'in_progress' | 'not_started',
            lastWatched: new Date().toISOString()
          };
        }
        return item;
      }));

      toast({
        title: "Progress updated",
        description: `Your progress in the lesson was updated to ${progress}%.`,
      });
    } catch (err: any) {
      console.error("Error updating lesson progress:", err);
      toast({
        title: "Error",
        description: "Failed to update lesson progress. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMarkNotificationAsRead = async (id: string) => {
    try {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id 
            ? { ...notif, read: true } 
            : notif
        )
      );
    } catch (err: any) {
      console.error("Error marking notification as read:", err);
      toast({
        title: "Error",
        description: "Failed to mark notification as read. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    lessons,
    lessonProgress,
    notifications,
    studentClass,
    updateLessonProgress,
    handleMarkNotificationAsRead,
    stats,
    isLoading,
    error
  };
};
