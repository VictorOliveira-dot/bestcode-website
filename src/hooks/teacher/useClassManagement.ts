
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ClassInfo } from "@/components/teacher/ClassItem";
import { 
  fetchClassesForTeacher, 
  addClass, 
  updateClass, 
  deleteClass 
} from "@/services/teacher/classService";
import { validateClassData } from "@/utils/teacher/classValidation";

export function useClassManagement() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch classes from Supabase
  useEffect(() => {
    if (user?.id) {
      fetchClasses();
    }
  }, [user?.id]);

  const fetchClasses = async () => {
    if (!user?.id) {
      setError("Usuário não está autenticado. Faça login novamente.");
      toast({
        title: "Erro de autenticação",
        description: "Usuário não está autenticado. Faça login novamente.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching classes for user:", user.id);
      const fetchedClasses = await fetchClassesForTeacher(user.id);
      setClasses(fetchedClasses);
    } catch (error: any) {
      console.error("Error fetching classes:", error);
      setError(error.message || "Ocorreu um erro ao buscar suas turmas.");
      toast({
        title: "Erro ao carregar turmas",
        description: error.message || "Ocorreu um erro ao buscar suas turmas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClass = async (newClass: {
    name: string;
    description: string;
    startDate: string;
  }) => {
    if (!user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Usuário não está autenticado. Faça login novamente.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!validateClassData(newClass)) {
      return false;
    }

    setIsLoading(true);
    try {
      console.log("Adding class for user:", user.id, "with data:", newClass);
      const newClassWithId = await addClass(user.id, newClass);
      
      // Add the new class to our local state
      setClasses(prev => [...prev, newClassWithId]);
      
      toast({
        title: "Turma adicionada",
        description: "A turma foi adicionada com sucesso."
      });
      return true;
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
    return false;
  };

  const handleEditClass = async (selectedClass: ClassInfo) => {
    if (!selectedClass || !user?.id) {
      toast({
        title: "Erro de dados",
        description: "Dados inválidos ou usuário não autenticado.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!validateClassData(selectedClass)) {
      return false;
    }

    setIsLoading(true);
    try {
      await updateClass(user.id, selectedClass);
      
      // Update local state
      const updatedClasses = classes.map(c => 
        c.id === selectedClass.id ? selectedClass : c
      );

      setClasses(updatedClasses);
      
      toast({
        title: "Turma atualizada",
        description: "A turma foi atualizada com sucesso."
      });
      return true;
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
    return false;
  };

  const handleDeleteClass = async (id: string) => {
    if (!user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Usuário não está autenticado. Faça login novamente.",
        variant: "destructive",
      });
      return false;
    }
    
    setIsLoading(true);
    try {
      await deleteClass(user.id, id);
      
      // Update local state
      const updatedClasses = classes.filter(c => c.id !== id);
      setClasses(updatedClasses);
      
      toast({
        title: "Turma removida",
        description: "A turma foi removida com sucesso."
      });
      return true;
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
    return false;
  };

  return {
    classes,
    isLoading,
    error,
    fetchClasses,
    handleAddClass,
    handleEditClass,
    handleDeleteClass
  };
}
