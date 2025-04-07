
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ClassInfo } from "@/components/teacher/ClassItem";

export function useClassManagement() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Verifica se o usuário é um usuário de teste (não autenticado no Supabase)
  const isTestUser = user && !user.id.includes('-');

  // Fetch classes from Supabase
  useEffect(() => {
    fetchClasses();
  }, [user]);

  const fetchClasses = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching classes for teacher ID:", user.id);
      
      // Se for um usuário de teste, retorna dados fictícios
      if (isTestUser) {
        console.log("Using test user mode");
        // Dados fictícios para usuários de teste
        const mockClasses = [
          {
            id: "1",
            name: "Turma de Teste 1",
            description: "Descrição da turma de teste 1",
            startDate: "2025-04-01",
            studentsCount: 5
          },
          {
            id: "2",
            name: "Turma de Teste 2",
            description: "Descrição da turma de teste 2",
            startDate: "2025-04-15",
            studentsCount: 3
          }
        ];
        
        setClasses(mockClasses);
        return;
      }
      
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
        setError(error.message);
        throw error;
      }
      
      if (data) {
        console.log("Classes fetched:", data.length);
        
        // Get student counts for each class separately
        const classesWithStudents: ClassInfo[] = await Promise.all(
          data.map(async (cls) => {
            try {
              const { count, error: countError } = await supabase
                .from('enrollments')
                .select('id', { count: 'exact', head: true })
                .eq('class_id', cls.id);
              
              if (countError) throw countError;
              
              return {
                id: cls.id,
                name: cls.name,
                description: cls.description,
                startDate: cls.start_date,
                studentsCount: count || 0
              };
            } catch (err) {
              // If there's an error counting students, return 0
              console.error("Error counting students for class:", cls.id, err);
              return {
                id: cls.id,
                name: cls.name,
                description: cls.description,
                startDate: cls.start_date,
                studentsCount: 0
              };
            }
          })
        );
        
        setClasses(classesWithStudents);
      }
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
    if (!user) return false;
    
    if (!newClass.name || !newClass.description || !newClass.startDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Para usuário de teste, simula a adição de uma turma
      if (isTestUser) {
        const newClassId = Math.random().toString().substring(2, 10);
        const newClassWithId: ClassInfo = {
          id: newClassId,
          name: newClass.name,
          description: newClass.description,
          startDate: newClass.startDate,
          studentsCount: 0
        };
        
        setClasses([...classes, newClassWithId]);
        
        toast({
          title: "Turma adicionada (modo teste)",
          description: "A turma foi adicionada com sucesso no modo teste."
        });
        return true;
      }
      
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
        
        toast({
          title: "Turma adicionada",
          description: "A turma foi adicionada com sucesso."
        });
        return true;
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
    return false;
  };

  const handleEditClass = async (selectedClass: ClassInfo) => {
    if (!selectedClass || !user) return false;
    
    if (!selectedClass.name || !selectedClass.description || !selectedClass.startDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Para usuário de teste, simula a edição de uma turma
      if (isTestUser) {
        // Update local state
        const updatedClasses = classes.map(c => 
          c.id === selectedClass.id ? selectedClass : c
        );

        setClasses(updatedClasses);
        
        toast({
          title: "Turma atualizada (modo teste)",
          description: "A turma foi atualizada com sucesso no modo teste."
        });
        return true;
      }
      
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
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Para usuário de teste, simula a exclusão de uma turma
      if (isTestUser) {
        // Update local state
        const updatedClasses = classes.filter(c => c.id !== id);
        setClasses(updatedClasses);
        
        toast({
          title: "Turma removida (modo teste)",
          description: "A turma foi removida com sucesso no modo teste."
        });
        return true;
      }
      
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
    fetchClasses, // Expose this so components can retry
    handleAddClass,
    handleEditClass,
    handleDeleteClass
  };
}
