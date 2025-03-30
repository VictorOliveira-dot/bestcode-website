
import React from "react";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Users, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StudentLessonItemProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    youtubeUrl: string;
    date: string;
    class: string;
  };
  progress: {
    watchTimeMinutes: number;
    lastWatched: string | null;
    progress: number; // 0-100
    status: 'completed' | 'in_progress' | 'not_started';
  };
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
        <Video className="h-4 w-4 text-bestcode-600" />
        <h3 className="font-semibold">{lesson.title}</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
      
      <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(lesson.date).toLocaleDateString('pt-BR')}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          Turma: {lesson.class}
        </span>
        {progress.lastWatched && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
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
