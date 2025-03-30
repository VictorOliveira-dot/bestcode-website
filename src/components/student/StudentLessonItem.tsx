import React from "react";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Users, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Lesson, LessonProgress } from "./types/lesson";

interface StudentLessonItemProps {
  lesson: Lesson;
  progress: LessonProgress;
  onClick: () => void;
}

const StudentLessonItem: React.FC<StudentLessonItemProps> = ({ 
  lesson, 
  progress,
  onClick 
}) => {
  // Format status for display
  const statusDisplay = {
    'completed': 'Concluído',
    'in_progress': 'Em andamento',
    'not_started': 'Não iniciado'
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <Video className="h-4 w-4 text-bestcode-600 flex-shrink-0" />
        <h3 className="font-semibold line-clamp-1">{lesson.title}</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{lesson.description}</p>
      
      <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3 flex-shrink-0" />
          {new Date(lesson.date).toLocaleDateString('pt-BR')}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3 flex-shrink-0" />
          Turma: {lesson.class}
        </span>
        {progress.lastWatched && (
          <span className="flex items-center gap-1 w-full sm:w-auto mt-1 sm:mt-0">
            <Clock className="h-3 w-3 flex-shrink-0" />
            Último acesso: {new Date(progress.lastWatched).toLocaleDateString('pt-BR')}
          </span>
        )}
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Progresso: {progress.progress}%</span>
          <span className="text-bestcode-600">{statusDisplay[progress.status]}</span>
        </div>
        <Progress value={progress.progress} className="h-2" />
      </div>

      <Button 
        variant="outline" 
        size="sm"
        className="w-full"
        onClick={onClick}
      >
        {progress.status === 'not_started' ? 'Iniciar aula' : 'Continuar aula'}
      </Button>
    </div>
  );
};

export default StudentLessonItem;
