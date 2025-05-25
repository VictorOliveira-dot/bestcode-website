
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
  const [classes, setClasses] = useState<Class[]>(availableClasses);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [lessonDetails, setLessonDetails] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    date: new Date().toISOString().split("T")[0],
    visibility: "class_only" as 'all' | 'class_only',
  });

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
      setSelectedClassId(classes.length > 0 ? classes[0].id : "");
    }
  }, [isOpen, classes]);

  // Update classes when availableClasses prop changes
  useEffect(() => {
    setClasses(availableClasses);
  }, [availableClasses]);

  const handleClassesUpdate = async () => {
    try {
      const { data: updatedClasses, error } = await supabase.rpc('get_teacher_classes', {
        teacher_id: user?.id
      });

      if (error) {
        console.error('Error fetching updated classes:', error);
        return;
      }

      const formattedClasses = updatedClasses?.map((cls: any) => ({
        id: cls.id,
        name: cls.name
      })) || [];
      
      setClasses(formattedClasses);
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
              
              <ClassSelector
                classes={classes}
                selectedClassId={selectedClassId}
                onClassChange={setSelectedClassId}
                onClassesUpdate={handleClassesUpdate}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-shrink-0">
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
