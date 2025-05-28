
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import VideoPlayerModal from "./VideoPlayerModal";
import LessonsList from "./LessonsList";
import StudentDocumentation from "./StudentDocumentation";
import { useLessonState } from "./hooks/useLessonState";
import { Lesson, LessonProgress } from "./types/lesson";
import { Skeleton } from "@/components/ui/skeleton";

interface StudentLessonsPanelProps {
  lessons: Lesson[];
  studentClass: string;
  lessonProgress: LessonProgress[];
  updateLessonProgress: (lessonId: string, watchTimeMinutes: number, progress: number) => Promise<void>;
  isLoading?: boolean;
}

const StudentLessonsPanel: React.FC<StudentLessonsPanelProps> = ({
  lessons,
  studentClass,
  lessonProgress,
  updateLessonProgress,
  isLoading = false
}) => {
  const [showDocumentation, setShowDocumentation] = useState(false);

  const {
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
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">Turma: {studentClass}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDocumentation(true)}
            className="flex items-center gap-2"
          >
            <HelpCircle className="h-4 w-4" />
            Documentação
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="not_started">
        <TabsList className="mb-4 w-full overflow-x-auto flex flex-nowrap">
          <TabsTrigger value="not_started">Não Iniciadas</TabsTrigger>
          <TabsTrigger value="recent">Continuar Assistindo</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
          <TabsTrigger value="complementary">Cursos Complementares</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="not_started">
          <LessonsList
            lessons={notStartedLessons}
            getLessonProgress={getLessonProgress}
            onLessonClick={handleLessonClick}
            emptyMessage="Você já iniciou todas as aulas disponíveis."
          />
        </TabsContent>
        
        <TabsContent value="recent">
          <LessonsList
            lessons={recentLessons}
            getLessonProgress={getLessonProgress}
            onLessonClick={handleLessonClick}
            emptyMessage="Você não tem aulas em andamento. Comece uma nova aula!"
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

        <TabsContent value="complementary">
          <LessonsList
            lessons={complementaryLessons}
            getLessonProgress={getLessonProgress}
            onLessonClick={handleLessonClick}
            emptyMessage="Nenhum curso complementar disponível no momento."
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
          onNextLesson={handleNextLesson}
          onPreviousLesson={handlePreviousLesson}
          hasNextLesson={!!getNextLesson(selectedLesson.id)}
          hasPreviousLesson={!!getPreviousLesson(selectedLesson.id)}
        />
      )}

      <StudentDocumentation 
        isOpen={showDocumentation}
        onClose={() => setShowDocumentation(false)}
      />
    </div>
  );
};

export default StudentLessonsPanel;
