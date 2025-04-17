
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClassForm, ClassFormValues } from "./ClassForm";
import { useTeachers } from "@/hooks/admin/useTeachers";
import { useClassCreation } from "@/hooks/admin/useClassCreation";
import { PlusCircle } from "lucide-react";

interface AddClassDialogProps {
  onClassAdded: () => void;
}

const AddClassDialog: React.FC<AddClassDialogProps> = ({ onClassAdded }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { teachers, fetchTeachers } = useTeachers(isOpen);
  const { createClass, isLoading } = useClassCreation(() => {
    setIsOpen(false);
    onClassAdded();
  });

  React.useEffect(() => {
    if (isOpen) {
      fetchTeachers();
    }
  }, [isOpen, fetchTeachers]);

  const handleSubmit = async (data: ClassFormValues) => {
    await createClass(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setIsOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Turma
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Turma</DialogTitle>
        </DialogHeader>
        <ClassForm
          onSubmit={handleSubmit}
          teachers={teachers}
          isLoading={isLoading}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddClassDialog;
