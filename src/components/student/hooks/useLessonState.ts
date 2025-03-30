
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Lesson, LessonProgress } from "../types/lesson";

export function useLessonState(
  lessons: Lesson[],
  studentClass: string,
  lessonProgress: LessonProgress[],
  updateLessonProgress: (lessonId: string, watchTimeMinutes: number, progress: number) => void
) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  // Filter lessons available to the student (those for their class or marked as 'all')
  const availableLessons = lessons.filter(lesson => 
    lesson.visibility === 'all' || lesson.class === studentClass
  );

  // Get recent and completed lessons based on progress
  const recentLessons = availableLessons
    .filter(lesson => {
      const progress = lessonProgress.find(p => p.lessonId === lesson.id);
      return progress && progress.status === 'in_progress';
    })
    .sort((a, b) => {
      const progressA = lessonProgress.find(p => p.lessonId === a.id);
      const progressB = lessonProgress.find(p => p.lessonId === b.id);
      
      if (progressA && progressB && progressA.lastWatched && progressB.lastWatched) {
        return new Date(progressB.lastWatched).getTime() - new Date(progressA.lastWatched).getTime();
      }
      return 0;
    });

  const completedLessons = availableLessons.filter(lesson => {
    const progress = lessonProgress.find(p => p.lessonId === lesson.id);
    return progress && progress.status === 'completed';
  });

  const notStartedLessons = availableLessons.filter(lesson => {
    const progress = lessonProgress.find(p => p.lessonId === lesson.id);
    return !progress || progress.status === 'not_started';
  });

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsVideoModalOpen(true);
  };

  const handleProgressUpdate = (lessonId: string, watchTimeMinutes: number, progress: number) => {
    updateLessonProgress(lessonId, watchTimeMinutes, progress);
    
    // Show completion toast when a lesson reaches 100%
    if (progress === 100) {
      toast({
        title: "Aula concluída!",
        description: "Parabéns! Você completou esta aula.",
      });
    }
  };

  const getLessonProgress = (lessonId: string): LessonProgress => {
    const progress = lessonProgress.find(p => p.lessonId === lessonId);
    
    if (!progress) {
      // Return an object that matches the LessonProgress interface
      return {
        lessonId: lessonId,
        watchTimeMinutes: 0,
        lastWatched: null,
        progress: 0,
        status: 'not_started' as const
      };
    }
    
    return progress;
  };

  return {
    selectedLesson,
    isVideoModalOpen,
    setIsVideoModalOpen,
    availableLessons,
    recentLessons,
    completedLessons,
    notStartedLessons,
    handleLessonClick,
    handleProgressUpdate,
    getLessonProgress
  };
}
