
import React from "react";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Users, BookOpen } from "lucide-react";

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
}

const LessonItem: React.FC<LessonItemProps> = ({ lesson, onDelete }) => {
  return (
    <div className="p-4 border rounded-lg flex justify-between items-start">
      <div>
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-bestcode-600" />
          <h3 className="font-semibold">{lesson.title}</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
        <div className="flex gap-3 mt-2 text-xs text-gray-500">
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
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open(lesson.youtubeUrl, '_blank')}
        >
          Ver
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onDelete(lesson.id)}
        >
          Excluir
        </Button>
      </div>
    </div>
  );
};

export default LessonItem;
