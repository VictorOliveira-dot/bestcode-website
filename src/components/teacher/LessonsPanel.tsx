
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LessonItem from "./LessonItem";
import { Class } from "@/hooks/teacher/useDashboardData";

interface Lesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  date: string;
  class: string;
  visibility: 'all' | 'class_only';
}

interface LessonsPanelProps {
  lessons: Lesson[];
  availableClasses: Class[];
  onDeleteLesson: (id: string) => void;
  onEditLesson: (id: string, updatedLesson: any) => void;
}

const LessonsPanel: React.FC<LessonsPanelProps> = ({ 
  lessons, 
  availableClasses, 
  onDeleteLesson,
  onEditLesson
}) => {
  console.log("LessonsPanel - Received lessons:", lessons);
  console.log("LessonsPanel - Available classes:", availableClasses);

  // Sort lessons by date (more recent first)
  const sortedLessons = [...lessons].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  console.log("LessonsPanel - Sorted lessons:", sortedLessons);

  // Group lessons by class
  const lessonsByClass = availableClasses.map(classInfo => ({
    className: classInfo.name,
    lessons: sortedLessons.filter(lesson => 
      lesson.class === classInfo.name || lesson.visibility === 'all'
    )
  }));

  console.log("LessonsPanel - Lessons by class:", lessonsByClass);

  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-4">
        <TabsTrigger value="all">Todas as Aulas</TabsTrigger>
        {availableClasses.map(classInfo => (
          <TabsTrigger key={classInfo.id} value={classInfo.name}>{classInfo.name}</TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="all">
        <div className="space-y-4">
          {sortedLessons.length > 0 ? (
            sortedLessons.map(lesson => {
              console.log("Rendering lesson:", lesson);
              return (
                <LessonItem 
                  key={lesson.id} 
                  lesson={lesson} 
                  onDelete={onDeleteLesson}
                  onEdit={onEditLesson}
                  availableClasses={availableClasses}
                />
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma aula cadastrada. Adicione sua primeira aula!</p>
              <p className="text-sm mt-2">Debug: Recebidas {lessons.length} aulas</p>
            </div>
          )}
        </div>
      </TabsContent>
      
      {availableClasses.map(classInfo => (
        <TabsContent key={classInfo.id} value={classInfo.name}>
          <div className="space-y-4">
            {lessonsByClass.find(c => c.className === classInfo.name)?.lessons.length ? (
              lessonsByClass
                .find(c => c.className === classInfo.name)
                ?.lessons.map(lesson => (
                  <LessonItem 
                    key={lesson.id} 
                    lesson={lesson} 
                    onDelete={onDeleteLesson}
                    onEdit={onEditLesson}
                    availableClasses={availableClasses}
                  />
                ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhuma aula cadastrada para esta turma.
              </div>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default LessonsPanel;
