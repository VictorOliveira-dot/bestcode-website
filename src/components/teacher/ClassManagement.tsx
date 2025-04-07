
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import ClassTable from "./ClassTable";
import AddClassDialog from "./AddClassDialog";
import EditClassDialog from "./EditClassDialog";
import { ClassInfo } from "./ClassItem";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ClassManagement = () => {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
    startDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Fetch classes from Supabase
  useEffect(() => {
    const fetchClasses = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        console.log("Fetching classes for teacher ID:", user.id);
        
        // Get classes where the current teacher is the teacher_id
        const { data, error } = await supabase
          .from('classes')
          .select(`
            id,
            name,
            description,
            start_date
          `)
          .eq('teacher_id', user.id);
        
        if (error) {
          console.error("Error fetching classes:", error);
          throw error;
        }
        
        if (data) {
          console.log("Classes fetched:", data.length);
          
          // Obter contagem de alunos para cada classe de forma separada
          const classesWithStudents: ClassInfo[] = await Promise.all(
            data.map(async (cls) => {
              const { count, error: countError } = await supabase
                .from('enrollments')
                .select('id', { count: 'exact', head: true })
                .eq('class_id', cls.id);
              
              return {
                id: cls.id,
                name: cls.name,
                description: cls.description,
                startDate: cls.start_date,
                studentsCount: countError ? 0 : (count || 0)
              };
            })
          );
          
          setClasses(classesWithStudents);
        }
      } catch (error: any) {
        console.error("Error fetching classes:", error);
        toast({
          title: "Erro ao carregar turmas",
          description: error.message || "Ocorreu um erro ao buscar suas turmas.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClasses();
  }, [user]);

  const handleAddClass = async () => {
    if (!user) return;
    
    if (!newClass.name || !newClass.description || !newClass.startDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Insert new class into the database
      const { data, error } = await supabase
        .from('classes')
        .insert([{
          name: newClass.name,
          description: newClass.description,
          start_date: newClass.startDate,
          teacher_id: user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Add the new class to our local state
        const newClassWithId: ClassInfo = {
          id: data.id,
          name: data.name,
          description: data.description,
          startDate: data.start_date,
          studentsCount: 0
        };
        
        setClasses([...classes, newClassWithId]);
        setNewClass({ name: '', description: '', startDate: '' });
        setIsAddClassOpen(false);
        
        toast({
          title: "Turma adicionada",
          description: "A turma foi adicionada com sucesso."
        });
      }
    } catch (error: any) {
      console.error("Error adding class:", error);
      toast({
        title: "Erro ao adicionar turma",
        description: error.message || "Ocorreu um erro ao adicionar a turma.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClass = async () => {
    if (!selectedClass || !user) return;
    
    if (!selectedClass.name || !selectedClass.description || !selectedClass.startDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Update class in the database
      const { error } = await supabase
        .from('classes')
        .update({
          name: selectedClass.name,
          description: selectedClass.description,
          start_date: selectedClass.startDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedClass.id)
        .eq('teacher_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      const updatedClasses = classes.map(c => 
        c.id === selectedClass.id ? selectedClass : c
      );

      setClasses(updatedClasses);
      setIsEditClassOpen(false);
      
      toast({
        title: "Turma atualizada",
        description: "A turma foi atualizada com sucesso."
      });
    } catch (error: any) {
      console.error("Error updating class:", error);
      toast({
        title: "Erro ao atualizar turma",
        description: error.message || "Ocorreu um erro ao atualizar a turma.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Delete class from the database
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id)
        .eq('teacher_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      const updatedClasses = classes.filter(c => c.id !== id);
      setClasses(updatedClasses);
      
      toast({
        title: "Turma removida",
        description: "A turma foi removida com sucesso."
      });
    } catch (error: any) {
      console.error("Error deleting class:", error);
      toast({
        title: "Erro ao remover turma",
        description: error.message || "Ocorreu um erro ao remover a turma.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (classInfo: ClassInfo) => {
    setSelectedClass(classInfo);
    setIsEditClassOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <h2 className="text-2xl font-bold">Gerenciamento de Turmas</h2>
        <Button 
          onClick={() => setIsAddClassOpen(true)} 
          className="flex items-center gap-2 w-full sm:w-auto"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4" />
          Nova Turma
        </Button>
      </div>

      <ClassTable 
        classes={classes}
        openEditDialog={openEditDialog}
        handleDeleteClass={handleDeleteClass}
        isLoading={isLoading}
      />

      <AddClassDialog
        isOpen={isAddClassOpen}
        onOpenChange={setIsAddClassOpen}
        newClass={newClass}
        setNewClass={setNewClass}
        handleAddClass={handleAddClass}
        isLoading={isLoading}
      />

      <EditClassDialog
        isOpen={isEditClassOpen}
        onOpenChange={setIsEditClassOpen}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        handleEditClass={handleEditClass}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ClassManagement;
