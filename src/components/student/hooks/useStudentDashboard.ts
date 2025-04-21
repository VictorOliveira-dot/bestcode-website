
import { useState, useEffect } from "react";
import { User } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Mock data
const MOCK_LESSONS = [
  {
    id: "lesson1",
    title: "Introdução ao QA",
    description: "Fundamentos de testes e qualidade de software",
    date: "2023-09-10",
    completed: false,
    progress: 0,
    classId: "class1",
  },
  {
    id: "lesson2",
    title: "Testes Automatizados com Cypress",
    description: "Aprenda a criar testes end-to-end com Cypress",
    date: "2023-09-15",
    completed: false,
    progress: 25,
    classId: "class1",
  },
  {
    id: "lesson3",
    title: "Testes de API com Postman",
    description: "Testando APIs REST com Postman",
    date: "2023-09-20",
    completed: true,
    progress: 100,
    classId: "class1",
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

export const useStudentDashboard = () => {
  const [lessons, setLessons] = useState(MOCK_LESSONS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [studentClass, setStudentClass] = useState("QA-01");
  const [lessonProgress, setLessonProgress] = useState<Record<string, number>>({
    lesson1: 0,
    lesson2: 25,
    lesson3: 100,
  });

  const stats = {
    inProgressLessons: lessons.filter(l => l.progress > 0 && l.progress < 100).length,
    completedLessons: lessons.filter(l => l.progress === 100).length,
    overallProgress: Math.round(
      (lessons.reduce((acc, lesson) => acc + lesson.progress, 0) / 
      (lessons.length * 100)) * 100
    ),
    availableLessons: lessons.length,
  };

  const updateLessonProgress = (lessonId: string, progress: number) => {
    setLessonProgress(prev => ({
      ...prev,
      [lessonId]: progress
    }));

    // Update lessons array too
    setLessons(prev => 
      prev.map(lesson => 
        lesson.id === lessonId 
          ? { 
              ...lesson, 
              progress, 
              completed: progress === 100 
            } 
          : lesson
      )
    );

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
