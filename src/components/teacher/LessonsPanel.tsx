
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LessonItem from "./LessonItem";

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
  availableClasses: any[];
  onDeleteLesson: (id: string) => void;
  onEditLesson: (id: string, updatedLesson: any) => void;
}

const LessonsPanel: React.FC<LessonsPanelProps> = ({ 
  lessons, 
  availableClasses, 
  onDeleteLesson,
  onEditLesson
}) => {
  // Sort lessons by date (more recent first)
  const sortedLessons = [...lessons].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group lessons by class
  const lessonsByClass = availableClasses.map(className => ({
    className,
    lessons: sortedLessons.filter(lesson => 
      lesson.class === className || lesson.visibility === 'all'
    )
  }));

  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-4">
        <TabsTrigger value="all">Todas as Aulas</TabsTrigger>
        {availableClasses.map(className => (
          <TabsTrigger key={className} value={className}>{className}</TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="all">
        <div className="space-y-4">
          {sortedLessons.length > 0 ? (
            sortedLessons.map(lesson => (
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
              Nenhuma aula cadastrada. Adicione sua primeira aula!
            </div>
          )}
        </div>
      </TabsContent>
      
      {availableClasses.map(className => (
        <TabsContent key={className} value={className}>
          <div className="space-y-4">
            {lessonsByClass.find(c => c.className === className)?.lessons.length ? (
              lessonsByClass
                .find(c => c.className === className)
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
