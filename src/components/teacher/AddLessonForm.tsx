
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { PlusCircle } from "lucide-react";

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
  const { user } = useAuth();
  const [newLesson, setNewLesson] = useState<NewLesson>({
    title: "",
    description: "",
    youtubeUrl: "",
    date: new Date().toISOString().split("T")[0],
    classId: "",
    visibility: "class_only",
  });

  const [showCreateClass, setShowCreateClass] = useState(false);
  const [newClass, setNewClass] = useState({
    name: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
  });
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [classes, setClasses] = useState<Class[]>(availableClasses);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setNewLesson({
        title: "",
        description: "",
        youtubeUrl: "",
        date: new Date().toISOString().split("T")[0],
        classId: classes.length > 0 ? classes[0].id : "",
        visibility: "class_only",
      });
      setShowCreateClass(false);
      setNewClass({
        name: "",
        description: "",
        startDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [isOpen, classes]);

  // Update classes when availableClasses prop changes
  useEffect(() => {
    setClasses(availableClasses);
  }, [availableClasses]);

  const handleCreateClass = async () => {
    if (!newClass.name.trim() || !newClass.description.trim()) {
      toast({
        title: "Erro",
        description: "Nome e descrição da turma são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingClass(true);
    try {
      console.log("Creating new class:", newClass);
      
      const { data, error } = await supabase.rpc('create_teacher_class', {
        p_name: newClass.name,
        p_description: newClass.description,
        p_start_date: newClass.startDate
      });

      if (error) {
        console.error('Error creating class:', error);
        throw error;
      }

      console.log("Class created successfully with ID:", data);

      // Fetch updated classes list
      const { data: updatedClasses, error: fetchError } = await supabase.rpc('get_teacher_classes', {
        teacher_id: user?.id
      });

      if (fetchError) {
        console.error('Error fetching updated classes:', fetchError);
        throw fetchError;
      }

      console.log("Updated classes:", updatedClasses);
      
      // Update local classes state
      const formattedClasses = updatedClasses?.map((cls: any) => ({
        id: cls.id,
        name: cls.name
      })) || [];
      
      setClasses(formattedClasses);
      
      // Set the newly created class as selected
      setNewLesson(prev => ({ ...prev, classId: data }));
      setShowCreateClass(false);
      
      toast({
        title: "Turma criada",
        description: "A turma foi criada com sucesso",
      });

      // Reset new class form
      setNewClass({
        name: "",
        description: "",
        startDate: new Date().toISOString().split("T")[0],
      });
    } catch (error: any) {
      console.error('Error creating class:', error);
      toast({
        title: "Erro ao criar turma",
        description: error.message || "Ocorreu um erro ao criar a turma",
        variant: "destructive"
      });
    } finally {
      setIsCreatingClass(false);
    }
  };

  const handleSubmit = async () => {
    if (!newLesson.classId) {
      toast({
        title: "Erro",
        description: "Selecione uma turma para a aula",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.rpc('create_lesson', {
        p_title: newLesson.title,
        p_description: newLesson.description,
        p_youtube_url: newLesson.youtubeUrl,
        p_date: newLesson.date,
        p_class_id: newLesson.classId,
        p_visibility: newLesson.visibility
      });

      if (error) throw error;

      onOpenChange(false);
      onAddLesson(newLesson);
      
      toast({
        title: "Aula criada",
        description: "A aula foi criada com sucesso",
      });
    } catch (error: any) {
      console.error('Error creating lesson:', error);
      toast({
        title: "Erro ao criar aula",
        description: error.message || "Ocorreu um erro ao criar a aula",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="class">Turma</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateClass(!showCreateClass)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  {showCreateClass ? "Cancelar" : "Criar Turma"}
                </Button>
              </div>
              
              {showCreateClass ? (
                <div className="space-y-3 p-4 border rounded-md bg-gray-50">
                  <div>
                    <Label htmlFor="className">Nome da Turma</Label>
                    <Input
                      id="className"
                      value={newClass.name}
                      onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                      placeholder="Nome da nova turma"
                    />
                  </div>
                  <div>
                    <Label htmlFor="classDescription">Descrição da Turma</Label>
                    <Textarea
                      id="classDescription"
                      value={newClass.description}
                      onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                      placeholder="Descrição da nova turma"
                    />
                  </div>
                  <div>
                    <Label htmlFor="classStartDate">Data de Início</Label>
                    <Input
                      id="classStartDate"
                      type="date"
                      value={newClass.startDate}
                      onChange={(e) => setNewClass({ ...newClass, startDate: e.target.value })}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleCreateClass}
                    disabled={isCreatingClass}
                    className="w-full"
                  >
                    {isCreatingClass ? "Criando..." : "Criar Turma"}
                  </Button>
                </div>
              ) : (
                <Select
                  value={newLesson.classId}
                  onValueChange={(value) => setNewLesson({ ...newLesson, classId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
