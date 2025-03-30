
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import ClassTable from "./ClassTable";
import AddClassDialog from "./AddClassDialog";
import EditClassDialog from "./EditClassDialog";
import { ClassInfo } from "./ClassItem";

const ClassManagement = () => {
  const [classes, setClasses] = useState<ClassInfo[]>(() => {
    const savedClasses = localStorage.getItem('teacher_classes');
    return savedClasses ? JSON.parse(savedClasses) : [
      {
        id: '1',
        name: 'QA-01',
        description: 'Turma de Quality Assurance - Básico',
        startDate: '2023-05-15',
        studentsCount: 12
      },
      {
        id: '2',
        name: 'QA-02',
        description: 'Turma de Quality Assurance - Avançado',
        startDate: '2023-07-10',
        studentsCount: 8
      },
      {
        id: '3',
        name: 'DEV-01',
        description: 'Turma de Desenvolvimento Frontend',
        startDate: '2023-04-05',
        studentsCount: 15
      },
      {
        id: '4',
        name: 'DEV-02',
        description: 'Turma de Desenvolvimento Backend',
        startDate: '2023-06-20',
        studentsCount: 10
      }
    ];
  });

  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
    startDate: '',
  });

  // Save classes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('teacher_classes', JSON.stringify(classes));
  }, [classes]);

  const handleAddClass = () => {
    if (!newClass.name || !newClass.description || !newClass.startDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const classWithId = {
      ...newClass,
      id: Date.now().toString(),
      studentsCount: 0 // New class starts with 0 students
    };

    setClasses([...classes, classWithId]);
    setNewClass({ name: '', description: '', startDate: '' });
    setIsAddClassOpen(false);
    
    toast({
      title: "Turma adicionada",
      description: "A turma foi adicionada com sucesso."
    });
  };

  const handleEditClass = () => {
    if (!selectedClass || !selectedClass.name || !selectedClass.description || !selectedClass.startDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const updatedClasses = classes.map(c => 
      c.id === selectedClass.id ? selectedClass : c
    );

    setClasses(updatedClasses);
    setIsEditClassOpen(false);
    
    toast({
      title: "Turma atualizada",
      description: "A turma foi atualizada com sucesso."
    });
  };

  const handleDeleteClass = (id: string) => {
    const updatedClasses = classes.filter(c => c.id !== id);
    setClasses(updatedClasses);
    
    toast({
      title: "Turma removida",
      description: "A turma foi removida com sucesso."
    });
  };

  const openEditDialog = (classInfo: ClassInfo) => {
    setSelectedClass(classInfo);
    setIsEditClassOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <h2 className="text-2xl font-bold">Gerenciamento de Turmas</h2>
        <Button onClick={() => setIsAddClassOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Nova Turma
        </Button>
      </div>

      <ClassTable 
        classes={classes}
        openEditDialog={openEditDialog}
        handleDeleteClass={handleDeleteClass}
      />

      <AddClassDialog
        isOpen={isAddClassOpen}
        onOpenChange={setIsAddClassOpen}
        newClass={newClass}
        setNewClass={setNewClass}
        handleAddClass={handleAddClass}
      />

      <EditClassDialog
        isOpen={isEditClassOpen}
        onOpenChange={setIsEditClassOpen}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        handleEditClass={handleEditClass}
      />
    </div>
  );
};

export default ClassManagement;
