
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Pencil, Trash2, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import EditLessonModal from "./modals/EditLessonModal";

interface Lesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  date: string;
  class: string;
  class_id: string;
  visibility: 'all' | 'class_only';
}

interface LessonsPanelProps {
  lessons: Lesson[];
  availableClasses: any[];
  onDeleteLesson: (lessonId: string) => void;
  onEditLesson: (lessonId: string, updatedLesson: any) => void;
  isLoading: boolean;
}

const LessonsPanel: React.FC<LessonsPanelProps> = ({
  lessons,
  availableClasses,
  onDeleteLesson,
  onEditLesson,
  isLoading
}) => {
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (updatedLesson: any) => {
    if (editingLesson) {
      onEditLesson(editingLesson.id, updatedLesson);
      setIsEditModalOpen(false);
      setEditingLesson(null);
    }
  };

  const handleDeleteClick = (lessonId: string, lessonTitle: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a aula "${lessonTitle}"?`)) {
      onDeleteLesson(lessonId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhuma aula cadastrada</h3>
        <p className="text-muted-foreground">
          Comece criando sua primeira aula para os alunos
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg line-clamp-2 flex-1">{lesson.title}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(lesson)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(lesson.id, lesson.title)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="line-clamp-3">
                {lesson.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 shrink-0" />
                <span className="truncate">Turma: {lesson.class}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>
                  Data: {new Date(lesson.date).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant={lesson.visibility === 'all' ? 'default' : 'secondary'}>
                  {lesson.visibility === 'all' ? 'Todas as turmas' : 'Turma específica'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(lesson.youtubeUrl, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver aula
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EditLessonModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        lesson={editingLesson}
        availableClasses={availableClasses}
        onSubmit={handleEditSubmit}
      />
    </>
  );
};

export default LessonsPanel;
