
import React, { useState } from "react";
import ClassTable from "./ClassTable";
import AddClassDialog from "./AddClassDialog";
import EditClassDialog from "./EditClassDialog";
import { ClassInfo } from "./ClassItem";
import ClassManagementHeader from "./ClassManagementHeader";
import { useClassManagement } from "@/hooks/teacher/useClassManagement";
import { toast } from "@/hooks/use-toast";

const ClassManagement = () => {
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
    startDate: '',
  });
  
  const {
    classes,
    isLoading,
    error,
    fetchClasses,
    handleAddClass,
    handleEditClass,
    handleDeleteClass
  } = useClassManagement();

  const openEditDialog = (classInfo: ClassInfo) => {
    setSelectedClass(classInfo);
    setIsEditClassOpen(true);
  };

  const onAddClass = async () => {
    try {
      const success = await handleAddClass(newClass);
      if (success) {
        setNewClass({ name: '', description: '', startDate: '' });
        setIsAddClassOpen(false);
        toast({
          title: "Sucesso",
          description: "Turma adicionada com sucesso",
        });
      }
    } catch (error: any) {
      console.error("Error adding class:", error);
      toast({
        title: "Erro",
        description: error?.message || "Ocorreu um erro ao adicionar a turma",
        variant: "destructive"
      });
    }
  };

  const onEditClass = async () => {
    if (selectedClass) {
      try {
        const success = await handleEditClass(selectedClass);
        if (success) {
          setIsEditClassOpen(false);
          toast({
            title: "Sucesso",
            description: "Turma atualizada com sucesso",
          });
        }
      } catch (error: any) {
        console.error("Error editing class:", error);
        toast({
          title: "Erro",
          description: error?.message || "Ocorreu um erro ao atualizar a turma",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <ClassManagementHeader 
        onAddClassClick={() => setIsAddClassOpen(true)}
        isLoading={isLoading}
      />

      <div className="bg-white rounded-lg overflow-hidden">
        <ClassTable 
          classes={classes}
          openEditDialog={openEditDialog}
          handleDeleteClass={handleDeleteClass}
          isLoading={isLoading}
          error={error}
          refetch={fetchClasses}
        />
      </div>

      <AddClassDialog
        isOpen={isAddClassOpen}
        onOpenChange={setIsAddClassOpen}
        newClass={newClass}
        setNewClass={setNewClass}
        handleAddClass={onAddClass}
        isLoading={isLoading}
      />

      <EditClassDialog
        isOpen={isEditClassOpen}
        onOpenChange={setIsEditClassOpen}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        handleEditClass={onEditClass}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ClassManagement;
