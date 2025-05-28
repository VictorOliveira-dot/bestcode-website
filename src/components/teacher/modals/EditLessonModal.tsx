
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface EditLessonModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: Lesson | null;
  availableClasses: any[];
  onSubmit: (updatedLesson: any) => void;
}

const EditLessonModal: React.FC<EditLessonModalProps> = ({
  isOpen,
  onOpenChange,
  lesson,
  availableClasses,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    date: "",
    classId: "",
    visibility: "all" as 'all' | 'class_only'
  });

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title,
        description: lesson.description,
        youtubeUrl: lesson.youtubeUrl,
        date: lesson.date,
        classId: lesson.class_id,
        visibility: lesson.visibility
      });
    }
  }, [lesson]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Aula</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Aula</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Digite o título da aula"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descreva o conteúdo da aula"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">URL do YouTube</Label>
            <Input
              id="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={(e) => handleInputChange("youtubeUrl", e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data da Aula</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="classId">Turma</Label>
            <Select value={formData.classId} onValueChange={(value) => handleInputChange("classId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma turma" />
              </SelectTrigger>
              <SelectContent>
                {availableClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibilidade</Label>
            <Select value={formData.visibility} onValueChange={(value: 'all' | 'class_only') => handleInputChange("visibility", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as turmas</SelectItem>
                <SelectItem value="class_only">Apenas turma selecionada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLessonModal;
