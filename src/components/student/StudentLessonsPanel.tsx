
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentLessonItem from "./StudentLessonItem";
import VideoPlayerModal from "./VideoPlayerModal";
import { toast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";

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

interface StudentLessonsPanelProps {
  lessons: Lesson[];
  studentClass: string;
  lessonProgress: LessonProgress[];
  updateLessonProgress: (lessonId: string, watchTimeMinutes: number, progress: number) => void;
}

const StudentLessonsPanel: React.FC<StudentLessonsPanelProps> = ({
  lessons,
  studentClass,
  lessonProgress,
  updateLessonProgress
}) => {
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

  const getLessonProgress = (lessonId: string) => {
    const progress = lessonProgress.find(p => p.lessonId === lessonId);
    
    if (!progress) {
      return {
        watchTimeMinutes: 0,
        lastWatched: null,
        progress: 0,
        status: 'not_started' as const
      };
    }
    
    return progress;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Minhas Aulas</h2>
        <div className="text-sm text-gray-500">Turma: {studentClass}</div>
      </div>
      
      <Tabs defaultValue="recent">
        <TabsList className="mb-4">
          <TabsTrigger value="recent">Continuar Assistindo</TabsTrigger>
          <TabsTrigger value="not_started">Não Iniciadas</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          {recentLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentLessons.map(lesson => (
                <StudentLessonItem
                  key={lesson.id}
                  lesson={lesson}
                  progress={getLessonProgress(lesson.id)}
                  onClick={() => handleLessonClick(lesson)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Você não tem aulas em andamento. Comece uma nova aula!
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="not_started">
          {notStartedLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notStartedLessons.map(lesson => (
                <StudentLessonItem
                  key={lesson.id}
                  lesson={lesson}
                  progress={getLessonProgress(lesson.id)}
                  onClick={() => handleLessonClick(lesson)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Você já iniciou todas as aulas disponíveis.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedLessons.map(lesson => (
                <StudentLessonItem
                  key={lesson.id}
                  lesson={lesson}
                  progress={getLessonProgress(lesson.id)}
                  onClick={() => handleLessonClick(lesson)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Você ainda não concluiu nenhuma aula.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableLessons.length > 0 ? (
              availableLessons.map(lesson => (
                <StudentLessonItem
                  key={lesson.id}
                  lesson={lesson}
                  progress={getLessonProgress(lesson.id)}
                  onClick={() => handleLessonClick(lesson)}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                Nenhuma aula disponível para sua turma.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {selectedLesson && (
        <VideoPlayerModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          lesson={selectedLesson}
          savedProgress={{
            watchTimeMinutes: getLessonProgress(selectedLesson.id).watchTimeMinutes,
            progress: getLessonProgress(selectedLesson.id).progress
          }}
          onProgressUpdate={handleProgressUpdate}
        />
      )}
    </div>
  );
};

export default StudentLessonsPanel;
