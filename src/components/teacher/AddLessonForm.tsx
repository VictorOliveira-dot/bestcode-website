
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { NewLesson } from "@/components/student/types/lesson";
import { Class } from "@/hooks/teacher/useDashboardData";

interface AddLessonFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLesson: (lesson: NewLesson) => void;
  availableClasses: Class[];
}

const AddLessonForm: React.FC<AddLessonFormProps> = ({
  isOpen,
  onOpenChange,
  onAddLesson,
  availableClasses,
}) => {
  const [newLesson, setNewLesson] = useState<NewLesson>({
    title: "",
    description: "",
    youtubeUrl: "",
    date: new Date().toISOString().split("T")[0],
    classId: "",
    visibility: "class_only",
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setNewLesson({
        title: "",
        description: "",
        youtubeUrl: "",
        date: new Date().toISOString().split("T")[0],
        classId: availableClasses.length > 0 ? availableClasses[0].id : "",
        visibility: "class_only",
      });
    }
  }, [isOpen, availableClasses]);

  const handleSubmit = () => {
    onAddLesson(newLesson);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Aula</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newLesson.title}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                placeholder="Título da aula"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={newLesson.description}
                onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                placeholder="Descrição da aula"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="youtubeUrl">URL do vídeo (YouTube)</Label>
              <Input
                id="youtubeUrl"
                value={newLesson.youtubeUrl}
                onChange={(e) => setNewLesson({ ...newLesson, youtubeUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={newLesson.date}
                onChange={(e) => setNewLesson({ ...newLesson, date: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="class">Turma</Label>
              <Select
                value={newLesson.classId}
                onValueChange={(value) => setNewLesson({ ...newLesson, classId: value })}
              >
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
            
            <div className="grid gap-2">
              <Label htmlFor="visibility">Visibilidade</Label>
              <Select
                value={newLesson.visibility}
                onValueChange={(value) => 
                  setNewLesson({ 
                    ...newLesson, 
                    visibility: value as 'all' | 'class_only'
                  })
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
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Adicionar Aula
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddLessonForm;
