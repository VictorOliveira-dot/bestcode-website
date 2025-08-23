
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
  isLoading?: boolean;
}

const StudentLessonsPanel: React.FC<StudentLessonsPanelProps> = ({
  lessons,
  studentClass,
  isLoading = false
}) => {
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsVideoModalOpen(true);
  };

  // Filtrar aulas por visibilidade
  const availableLessons = lessons.filter(lesson => 
    lesson.visibility === 'all' || 
    (lesson.visibility === 'class_only' && lesson.class === studentClass)
  );
  
  const complementaryLessons = lessons.filter(lesson => 
    lesson.visibility === 'complementary'
  );

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
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4 w-full overflow-x-auto flex flex-nowrap">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="complementary">Cursos Complementares</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {availableLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleLessonClick(lesson)}
                >
                  <h3 className="font-semibold text-lg mb-2">{lesson.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
                  <div className="text-xs text-gray-500">
                    Data: {new Date(lesson.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma aula disponível para sua turma.
            </div>
          )}
        </TabsContent>

        <TabsContent value="complementary">
          {complementaryLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {complementaryLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow bg-blue-50"
                  onClick={() => handleLessonClick(lesson)}
                >
                  <h3 className="font-semibold text-lg mb-2">{lesson.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
                  <div className="text-xs text-blue-600 font-medium">
                    Curso Complementar
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum curso complementar disponível no momento.
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {selectedLesson && (
        <VideoPlayerModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          lesson={selectedLesson}
          savedProgress={{ watchTimeMinutes: 0, progress: 0 }}
          onProgressUpdate={async () => {}}
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
