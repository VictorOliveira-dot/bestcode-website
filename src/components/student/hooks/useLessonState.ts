import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Lesson, LessonProgress } from "../types/lesson";

export function useLessonState(
  lessons: Lesson[],
  studentClass: string,
  lessonProgress: LessonProgress[],
  updateLessonProgress: (lessonId: string, watchTimeMinutes: number, progress: number) => Promise<void>
) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  console.log('🎯 useLessonState - Input data:', {
    lessonsCount: lessons.length,
    studentClass,
    progressCount: lessonProgress.length,
    lessons: lessons.map(l => ({ 
      id: l.id, 
      title: l.title, 
      class: l.class, 
      class_id: l.class_id,
      visibility: l.visibility 
    }))
  });
  
  // Filter lessons available to the student
  const availableLessons = lessons.filter(lesson => {
    console.log(`🔍 Analyzing lesson "${lesson.title}":`, {
      lessonClass: lesson.class,
      lessonClassId: lesson.class_id,
      visibility: lesson.visibility,
      studentClass: studentClass
    });
    
    // Aulas visíveis para todos sempre são incluídas
    if (lesson.visibility === 'all') {
      console.log(`✅ Lesson "${lesson.title}" available - visibility: all`);
      return true;
    }
    
    // Aulas específicas da turma (class_only) - verificar se a turma bate
    if (lesson.visibility === 'class_only') {
      // Usar o nome da classe para comparar
      const classMatches = lesson.class === studentClass;
      
      console.log(`${classMatches ? '✅' : '❌'} Lesson "${lesson.title}" class_only - class match: ${lesson.class} === ${studentClass}`);
      return classMatches;
    }
    
    // Por padrão, incluir a aula se for da turma do estudante
    const belongsToStudentClass = lesson.class === studentClass;
    
    console.log(`${belongsToStudentClass ? '✅' : '❌'} Lesson "${lesson.title}" default - belongs to student class: ${belongsToStudentClass}`);
    return belongsToStudentClass;
  });

  console.log('✅ Available lessons after filtering:', availableLessons.length, availableLessons.map(l => l.title));

  // Filter complementary lessons
  const complementaryLessons = lessons.filter(lesson => 
    lesson.visibility === 'complementary'
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

  const notStartedLessons = availableLessons
    .filter(lesson => {
      const progress = lessonProgress.find(p => p.lessonId === lesson.id);
      return !progress || progress.status === 'not_started';
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  console.log('📊 Lessons categorized:', {
    available: availableLessons.length,
    recent: recentLessons.length,
    completed: completedLessons.length,
    notStarted: notStartedLessons.length,
    complementary: complementaryLessons.length
  });

  const handleLessonClick = (lesson: Lesson) => {
    console.log('🎬 Lesson clicked:', lesson.title);
    setSelectedLesson(lesson);
    setIsVideoModalOpen(true);
  };

  const handleProgressUpdate = async (lessonId: string, watchTimeMinutes: number, progress: number) => {
    try {
      console.log('📈 Updating progress:', { lessonId, watchTimeMinutes, progress });
      await updateLessonProgress(lessonId, watchTimeMinutes, progress);
      
      if (progress >= 100) {
        toast({
          title: "Aula concluída!",
          description: "Parabéns! Você completou esta aula.",
        });
      }
    } catch (error) {
      console.error('❌ Error updating progress in hook:', error);
    }
  };

  const getNextLesson = (currentLessonId: string): Lesson | null => {
    const currentIndex = availableLessons.findIndex(lesson => lesson.id === currentLessonId);
    if (currentIndex >= 0 && currentIndex < availableLessons.length - 1) {
      return availableLessons[currentIndex + 1];
    }
    return null;
  };

  const getPreviousLesson = (currentLessonId: string): Lesson | null => {
    const currentIndex = availableLessons.findIndex(lesson => lesson.id === currentLessonId);
    if (currentIndex > 0) {
      return availableLessons[currentIndex - 1];
    }
    return null;
  };

  const handleNextLesson = () => {
    if (selectedLesson) {
      const nextLesson = getNextLesson(selectedLesson.id);
      if (nextLesson) {
        setSelectedLesson(nextLesson);
        toast({
          title: "Próxima aula",
          description: `Iniciando: ${nextLesson.title}`,
        });
      } else {
        setIsVideoModalOpen(false);
        toast({
          title: "Parabéns!",
          description: "Você completou todas as aulas disponíveis!",
        });
      }
    }
  };

  const handlePreviousLesson = () => {
    if (selectedLesson) {
      const previousLesson = getPreviousLesson(selectedLesson.id);
      if (previousLesson) {
        setSelectedLesson(previousLesson);
        toast({
          title: "Aula anterior",
          description: `Iniciando: ${previousLesson.title}`,
        });
      } else {
        toast({
          title: "Primeira aula",
          description: "Esta é a primeira aula do curso.",
        });
      }
    }
  };

  const getLessonProgress = (lessonId: string): LessonProgress => {
    const progress = lessonProgress.find(p => p.lessonId === lessonId);
    
    if (!progress) {
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
    complementaryLessons,
    handleLessonClick,
    handleProgressUpdate,
    handleNextLesson,
    handlePreviousLesson,
    getNextLesson,
    getPreviousLesson,
    getLessonProgress
  };
}
