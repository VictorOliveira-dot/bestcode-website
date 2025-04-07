
import React, { useState } from "react";
import ClassTable from "./ClassTable";
import AddClassDialog from "./AddClassDialog";
import EditClassDialog from "./EditClassDialog";
import { ClassInfo } from "./ClassItem";
import ClassManagementHeader from "./ClassManagementHeader";
import { useClassManagement } from "@/hooks/teacher/useClassManagement";

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
    const success = await handleAddClass(newClass);
    if (success) {
      setNewClass({ name: '', description: '', startDate: '' });
      setIsAddClassOpen(false);
    }
  };

  const onEditClass = async () => {
    if (selectedClass) {
      const success = await handleEditClass(selectedClass);
      if (success) {
        setIsEditClassOpen(false);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      <ClassManagementHeader 
        onAddClassClick={() => setIsAddClassOpen(true)}
        isLoading={false} // Set to false to ensure button is enabled
      />

      <ClassTable 
        classes={classes}
        openEditDialog={openEditDialog}
        handleDeleteClass={handleDeleteClass}
        isLoading={isLoading}
        error={error}
        refetch={fetchClasses}
      />

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
