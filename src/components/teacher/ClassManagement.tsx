
import React, { useState } from "react";
import ClassTable from "./ClassTable";
import AddClassDialog from "./AddClassDialog";
import EditClassDialog from "./EditClassDialog";
import { ClassInfo } from "./ClassItem";
import ClassManagementHeader from "./ClassManagementHeader";
import { useClassManagement } from "@/hooks/teacher/useClassManagement";
import { useTeacherData } from "@/hooks/teacher/useTeacherData";
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
  
  // Usando o hook useTeacherData para obter as classes e refetchClasses
  const { classes, refetchClasses, isLoading: isLoadingTeacherData } = useTeacherData();

  const {
    isLoading: isLoadingManagement,
    error,
    handleAddClass,
    handleEditClass,
    handleDeleteClass
  } = useClassManagement();

  // Combinando os estados de carregamento
  const isLoading = isLoadingTeacherData || isLoadingManagement;

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
        // Recarregar a lista de turmas após adicionar
        await refetchClasses();
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
          // Recarregar a lista de turmas após editar
          await refetchClasses();
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

  const handleDelete = async (classId: string) => {
    const success = await handleDeleteClass(classId);
    if (success) {
      // Recarregar a lista de turmas após excluir
      await refetchClasses();
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
          handleDeleteClass={handleDelete}
          isLoading={isLoading}
          error={error}
          refetch={refetchClasses}
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
