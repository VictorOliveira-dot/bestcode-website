
import { useState, useEffect } from "react";
import { User } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Lesson, LessonProgress } from "../types/lesson";

// Mock data
const MOCK_LESSONS: Lesson[] = [
  {
    id: "lesson1",
    title: "Introdução ao QA",
    description: "Fundamentos de testes e qualidade de software",
    youtubeUrl: "https://www.youtube.com/watch?v=example1",
    date: "2023-09-10",
    class: "QA-01",
    class_id: "class1",
    visibility: "class_only"
  },
  {
    id: "lesson2",
    title: "Testes Automatizados com Cypress",
    description: "Aprenda a criar testes end-to-end com Cypress",
    youtubeUrl: "https://www.youtube.com/watch?v=example2",
    date: "2023-09-15",
    class: "QA-01",
    class_id: "class1",
    visibility: "class_only"
  },
  {
    id: "lesson3",
    title: "Testes de API com Postman",
    description: "Testando APIs REST com Postman",
    youtubeUrl: "https://www.youtube.com/watch?v=example3",
    date: "2023-09-20",
    class: "QA-01",
    class_id: "class1",
    visibility: "class_only"
  }
];

const MOCK_NOTIFICATIONS = [
  {
    id: "notif1",
    title: "Nova aula disponível",
    message: "A aula de Testes de API com Postman já está disponível.",
    date: "2023-09-19",
    read: false,
  },
  {
    id: "notif2",
    title: "Feedback do professor",
    message: "O professor adicionou feedback ao seu projeto de testes.",
    date: "2023-09-16",
    read: true,
  }
];

const MOCK_LESSON_PROGRESS: LessonProgress[] = [
  {
    lessonId: "lesson1",
    watchTimeMinutes: 0,
    lastWatched: null,
    progress: 0,
    status: "not_started"
  },
  {
    lessonId: "lesson2",
    watchTimeMinutes: 12,
    lastWatched: "2023-09-16T14:00:00Z",
    progress: 25,
    status: "in_progress"
  },
  {
    lessonId: "lesson3",
    watchTimeMinutes: 45,
    lastWatched: "2023-09-20T16:30:00Z",
    progress: 100,
    status: "completed"
  }
];

export const useStudentDashboard = () => {
  const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [studentClass, setStudentClass] = useState("QA-01");
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>(MOCK_LESSON_PROGRESS);

  const stats = {
    inProgressLessons: lessonProgress.filter(l => l.status === "in_progress").length,
    completedLessons: lessonProgress.filter(l => l.status === "completed").length,
    overallProgress: Math.round(
      (lessonProgress.reduce((acc, lesson) => acc + lesson.progress, 0) / 
      (lessonProgress.length * 100)) * 100
    ),
    availableLessons: lessons.length,
  };

  const updateLessonProgress = (lessonId: string, watchTimeMinutes: number, progress: number) => {
    setLessonProgress(prev => prev.map(item => {
      if (item.lessonId === lessonId) {
        const newStatus = progress >= 100 ? "completed" : progress > 0 ? "in_progress" : "not_started";
        return {
          ...item,
          watchTimeMinutes,
          progress,
          status: newStatus,
          lastWatched: new Date().toISOString()
        };
      }
      return item;
    }));

    toast({
      title: "Progresso atualizado",
      description: `Seu progresso na aula foi atualizado para ${progress}%.`,
    });
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id 
          ? { ...notif, read: true } 
          : notif
      )
    );
  };

  return {
    lessons,
    lessonProgress,
    notifications,
    studentClass,
    updateLessonProgress,
    handleMarkNotificationAsRead,
    stats
  };
};
