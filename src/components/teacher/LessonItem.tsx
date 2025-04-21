
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Users, BookOpen, Pencil } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import EditLessonForm from "./EditLessonForm";
import { Class } from "@/hooks/teacher/useDashboardData";

interface LessonItemProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    youtubeUrl: string;
    date: string;
    class: string;
    visibility: 'all' | 'class_only';
  };
  onDelete: (id: string) => void;
  onEdit: (id: string, updatedLesson: any) => void;
  availableClasses: Class[];
}

const LessonItem: React.FC<LessonItemProps> = ({ lesson, onDelete, onEdit, availableClasses }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <div className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div className="flex-grow w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-bestcode-600" />
            <h3 className="font-semibold">{lesson.title}</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(lesson.date).toLocaleDateString('pt-BR')}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Turma: {lesson.class}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {lesson.visibility === 'all' ? 'Visível para todos' : 'Apenas para a turma'}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => window.open(lesson.youtubeUrl, '_blank')}
          >
            Ver
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => setIsEditOpen(true)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm"
                className="w-full sm:w-auto"
              >
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir a aula "{lesson.title}"? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(lesson.id)}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <EditLessonForm
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        onEditLesson={onEdit}
        availableClasses={availableClasses}
        lesson={lesson}
      />
    </>
  );
};

export default LessonItem;
