
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NewLesson } from "@/components/student/types/lesson";
import { Class } from "@/hooks/teacher/useDashboardData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import ClassSelector from "./forms/ClassSelector";
import LessonDetailsForm from "./forms/LessonDetailsForm";
import { useTeacherData } from "@/hooks/teacher/useTeacherData";

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
  const { teacherClasses, refetchTeacherClasses } = useTeacherData();
  
  // Usar as turmas do professor do hook em vez das passadas por prop
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [lessonDetails, setLessonDetails] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    date: new Date().toISOString().split("T")[0],
    visibility: "class_only" as 'all' | 'class_only',
  });

  // Atualizar classes quando teacherClasses mudar
  useEffect(() => {
    if (teacherClasses && teacherClasses.length > 0) {
      const formattedClasses = teacherClasses.map(cls => ({
        id: cls.id,
        name: cls.name
      }));
      setClasses(formattedClasses);
      
      // Se não há classe selecionada, selecionar a primeira
      if (!selectedClassId && formattedClasses.length > 0) {
        setSelectedClassId(formattedClasses[0].id);
      }
    }
  }, [teacherClasses, selectedClassId]);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setLessonDetails({
        title: "",
        description: "",
        youtubeUrl: "",
        date: new Date().toISOString().split("T")[0],
        visibility: "class_only",
      });
      
      // Se há turmas disponíveis, selecionar a primeira
      if (classes.length > 0) {
        setSelectedClassId(classes[0].id);
      }
    }
  }, [isOpen, classes]);

  const handleClassesUpdate = async () => {
    try {
      console.log("Updating classes list...");
      await refetchTeacherClasses();
    } catch (error) {
      console.error('Error updating classes:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedClassId) {
      toast({
        title: "Erro",
        description: "Selecione uma turma para a aula",
        variant: "destructive"
      });
      return;
    }

    if (!lessonDetails.title.trim()) {
      toast({
        title: "Erro",
        description: "Digite um título para a aula",
        variant: "destructive"
      });
      return;
    }

    if (!lessonDetails.youtubeUrl.trim()) {
      toast({
        title: "Erro",
        description: "Digite a URL do vídeo do YouTube",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.rpc('create_lesson', {
        p_title: lessonDetails.title,
        p_description: lessonDetails.description,
        p_youtube_url: lessonDetails.youtubeUrl,
        p_date: lessonDetails.date,
        p_class_id: selectedClassId,
        p_visibility: lessonDetails.visibility
      });

      if (error) throw error;

      onOpenChange(false);
      onAddLesson({
        ...lessonDetails,
        classId: selectedClassId,
      });
      
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Aula</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-4">
              <LessonDetailsForm 
                lessonDetails={lessonDetails}
                onLessonDetailsChange={setLessonDetails}
              />
              
              {classes.length > 0 ? (
                <ClassSelector
                  classes={classes}
                  selectedClassId={selectedClassId}
                  onClassChange={setSelectedClassId}
                  onClassesUpdate={handleClassesUpdate}
                />
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>Nenhuma turma encontrada. Crie uma turma primeiro para adicionar aulas.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={!selectedClassId || classes.length === 0}
          >
            Adicionar Aula
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddLessonForm;
