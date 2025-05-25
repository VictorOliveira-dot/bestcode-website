
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface LessonDetails {
  title: string;
  description: string;
  youtubeUrl: string;
  date: string;
  visibility: 'all' | 'class_only';
}

interface LessonDetailsFormProps {
  lessonDetails: LessonDetails;
  onLessonDetailsChange: (details: LessonDetails) => void;
}

const LessonDetailsForm: React.FC<LessonDetailsFormProps> = ({
  lessonDetails,
  onLessonDetailsChange,
}) => {
  const handleChange = (field: keyof LessonDetails, value: string) => {
    onLessonDetailsChange({
      ...lessonDetails,
      [field]: value,
    });
  };

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={lessonDetails.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Título da aula"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={lessonDetails.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Descrição da aula"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="youtubeUrl">URL do vídeo (YouTube)</Label>
        <Input
          id="youtubeUrl"
          value={lessonDetails.youtubeUrl}
          onChange={(e) => handleChange('youtubeUrl', e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          type="date"
          value={lessonDetails.date}
          onChange={(e) => handleChange('date', e.target.value)}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="visibility">Visibilidade</Label>
        <Select
          value={lessonDetails.visibility}
          onValueChange={(value) => 
            handleChange('visibility', value as 'all' | 'class_only')
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a visibilidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os alunos</SelectItem>
            <SelectItem value="class_only">Apenas para a turma</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default LessonDetailsForm;
