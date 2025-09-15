
import React, { useEffect, useState } from "react";
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
import { useAuth } from "@/contexts/auth";

interface AddClassDialogProps {
  onClassAdded: () => void;
}

const AddClassDialog: React.FC<AddClassDialogProps> = ({ onClassAdded }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [authReady, setAuthReady] = useState(false);
  const { teachers, fetchTeachers, isLoading: teachersLoading } = useTeachers(isOpen && authReady);
  const { createClass, isLoading: creationLoading } = useClassCreation(() => {
    setIsOpen(false);
    onClassAdded();
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setAuthReady(true);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && authReady) {
      fetchTeachers();
    }
  }, [isOpen, fetchTeachers, authReady]);

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
          isLoading={creationLoading || teachersLoading}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddClassDialog;
