
import React, { useState } from "react";
import ClassTable from "./ClassTable";
import AddClassDialog from "./AddClassDialog";
import EditClassDialog from "./EditClassDialog";
import { ClassInfo } from "./ClassItem";
import ClassManagementHeader from "./ClassManagementHeader";
import { useClassManagement } from "@/hooks/teacher/useClassManagement";
import { useTeacherData } from "@/hooks/teacher/useTeacherData";
import { toast } from "@/hooks/use-toast";
import { Card } from "../ui/card";

const ClassManagement = () => {
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
    startDate: '',
  });
  
  // Using useTeacherData hook to get teacher's own classes and refetchTeacherClasses
  const { teacherClasses, refetchTeacherClasses, isLoading: isLoadingTeacherData } = useTeacherData();

  const {
    isLoading: isLoadingManagement,
    error,
    handleAddClass,
    handleEditClass,
    handleDeleteClass
  } = useClassManagement();

  // Combining loading states
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
        // Reload the list of classes after adding
        await refetchTeacherClasses();
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
          // Reload the list of classes after editing
          await refetchTeacherClasses();
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
      // Reload the list of classes after deleting
      await refetchTeacherClasses();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-6 p-4">
      <ClassManagementHeader 
        onAddClassClick={() => setIsAddClassOpen(true)}
        isLoading={isLoading}
      />

      <div className="bg-white rounded-lg overflow-hidden">
        <ClassTable 
          classes={teacherClasses}
          openEditDialog={openEditDialog}
          handleDeleteClass={handleDelete}
          isLoading={isLoading}
          error={error}
          refetch={refetchTeacherClasses}
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
      </Card>
    </div>
  );
};

export default ClassManagement;
