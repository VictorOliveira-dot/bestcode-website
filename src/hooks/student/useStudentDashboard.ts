
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";
import { Lesson, LessonProgress } from "@/components/student/types/lesson";
import { Notification } from "@/components/student/types/notification";

// Mock data
const MOCK_LESSONS: Lesson[] = [
  {
    id: "1",
    title: "Introdução ao Desenvolvimento Web",
    description: "Fundamentos de HTML, CSS e JavaScript",
    youtubeUrl: "https://youtube.com/watch?v=example1",
    date: "2023-09-15",
    class: "Web Development",
    class_id: "class1",
    visibility: "all"
  },
  {
    id: "2",
    title: "React Básico",
    description: "Conceitos fundamentais do React",
    youtubeUrl: "https://youtube.com/watch?v=example2",
    date: "2023-09-20",
    class: "Web Development",
    class_id: "class1",
    visibility: "all"
  }
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Nova aula disponível",
    message: "A aula de React Básico já está disponível",
    date: new Date().toISOString(),
    read: false
  }
];

export const useStudentDashboard = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [studentClass] = useState<string>("Web Development");
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Initialize lesson progress
    const initialProgress: LessonProgress[] = MOCK_LESSONS.map(lesson => ({
      lessonId: lesson.id,
      watchTimeMinutes: 0,
      lastWatched: null,
      progress: 0,
      status: 'not_started'
    }));

    setLessonProgress(initialProgress);
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
