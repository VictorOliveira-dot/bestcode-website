
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayerModal from "./VideoPlayerModal";
import LessonsList from "./LessonsList";
import { useLessonState } from "./hooks/useLessonState";
import { Lesson, LessonProgress } from "./types/lesson";
import { Skeleton } from "@/components/ui/skeleton";

interface StudentLessonsPanelProps {
  lessons: Lesson[];
  studentClass: string;
  lessonProgress: LessonProgress[];
  updateLessonProgress: (lessonId: string, watchTimeMinutes: number, progress: number) => void;
  isLoading?: boolean;
}

const StudentLessonsPanel: React.FC<StudentLessonsPanelProps> = ({
  lessons,
  studentClass,
  lessonProgress,
  updateLessonProgress,
  isLoading = false
}) => {
  const {
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
  } = useLessonState(lessons, studentClass, lessonProgress, updateLessonProgress);

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-xl font-bold">Minhas Aulas</h2>
        <div className="text-sm text-gray-500">Turma: {studentClass}</div>
      </div>
      
      <Tabs defaultValue="recent">
        <TabsList className="mb-4 w-full overflow-x-auto flex flex-nowrap">
          <TabsTrigger value="recent">Continuar Assistindo</TabsTrigger>
          <TabsTrigger value="not_started">Não Iniciadas</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          <LessonsList
            lessons={recentLessons}
            getLessonProgress={getLessonProgress}
            onLessonClick={handleLessonClick}
            emptyMessage="Você não tem aulas em andamento. Comece uma nova aula!"
          />
        </TabsContent>
        
        <TabsContent value="not_started">
          <LessonsList
            lessons={notStartedLessons}
            getLessonProgress={getLessonProgress}
            onLessonClick={handleLessonClick}
            emptyMessage="Você já iniciou todas as aulas disponíveis."
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <LessonsList
            lessons={completedLessons}
            getLessonProgress={getLessonProgress}
            onLessonClick={handleLessonClick}
            emptyMessage="Você ainda não concluiu nenhuma aula."
          />
        </TabsContent>
        
        <TabsContent value="all">
          {availableLessons.length > 0 ? (
            <LessonsList
              lessons={availableLessons}
              getLessonProgress={getLessonProgress}
              onLessonClick={handleLessonClick}
              emptyMessage=""
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma aula disponível para sua turma.
            </div>
          )}
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
