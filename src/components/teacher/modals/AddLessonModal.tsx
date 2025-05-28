
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddLessonForm from "../AddLessonForm";

interface Class {
  id: string;
  name: string;
}

interface AddLessonModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLesson: () => Promise<void>;
  availableClasses: Class[];
}

const AddLessonModal: React.FC<AddLessonModalProps> = ({
  isOpen,
  onOpenChange,
  onAddLesson,
  availableClasses
}) => {
  const handleSuccess = async () => {
    await onAddLesson();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Aula</DialogTitle>
        </DialogHeader>
        <AddLessonForm 
          availableClasses={availableClasses}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddLessonModal;
