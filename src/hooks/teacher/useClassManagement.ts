
import { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { ClassInfo } from '@/components/teacher/ClassItem';
import { toast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { validateClassData } from '@/utils/teacher/classValidation';

export const useClassManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleAddClass = async (classData: { name: string; description: string; startDate: string }) => {
    setIsLoading(true);
    
    // Validate class data
    if (!validateClassData(classData)) {
      setIsLoading(false);
      return false;
    }
    
    try {
      // console.log("Creating class with data:", classData);
      // console.log("Current user:", user);
      
      if (!user?.id) {
        throw new Error("Usuário não autenticado ou ID não disponível");
      }
      
      // Call the Supabase RPC function to create a teacher class
      const { data, error } = await supabase.rpc('create_teacher_class', {
        p_name: classData.name,
        p_description: classData.description,
        p_start_date: classData.startDate
      });
      
      if (error) {
        
        throw error;
      }
      
      // console.log("Class created successfully:", data);
      
      toast({
        title: 'Turma criada',
        description: 'Nova turma foi criada com sucesso'
      });
      
      return true;
    } catch (err: any) {
      
      setError(err.message || 'Falha ao criar turma');
      toast({
        title: 'Erro ao criar turma',
        description: err.message || 'Falha ao criar turma',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClass = async (classData: ClassInfo) => {
    setIsLoading(true);
    
    // Validate class data
    if (!validateClassData(classData)) {
      setIsLoading(false);
      return false;
    }
    
    try {
      // console.log("Updating class with data:", classData);
      
      if (!user?.id) {
        throw new Error("Usuário não autenticado ou ID não disponível");
      }
      
      // Call the Supabase RPC function to update a class
      const { error } = await supabase.rpc('update_class', {
        p_class_id: classData.id,
        p_name: classData.name,
        p_description: classData.description,
        p_start_date: classData.startDate,
        p_teacher_id: user.id
      });
      
      if (error) {
        
        throw error;
      }
      
      toast({
        title: 'Turma atualizada',
        description: 'Turma foi atualizada com sucesso'
      });
      
      return true;
    } catch (err: any) {
      
      setError(err.message || 'Falha ao atualizar turma');
      toast({
        title: 'Erro ao atualizar turma',
        description: err.message || 'Falha ao atualizar turma',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    setIsLoading(true);
    try {
      // Verificar se a turma tem alunos
      const { data: hasStudents } = await supabase.rpc('check_class_has_students', {
        p_class_id: classId
      });

      if (hasStudents) {
        toast({
          title: 'Não é possível excluir',
          description: 'Não é possível excluir, primeiro desvincule os alunos.',
          variant: 'destructive'
        });
        return false;
      }

      if (!window.confirm('Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita.')) {
        return false;
      }
      
      if (!user?.id) {
        throw new Error("Usuário não autenticado ou ID não disponível");
      }
      
      // Call the Supabase RPC function to delete a class
      const { error } = await supabase.rpc('delete_class', {
        p_class_id: classId,
        p_teacher_id: user.id
      });
      
      if (error) {
        
        throw error;
      }
      
      toast({
        title: 'Turma excluída',
        description: 'Turma foi excluída com sucesso'
      });
      
      return true;
    } catch (err: any) {
      
      setError(err.message || 'Falha ao excluir turma');
      toast({
        title: 'Erro ao excluir turma',
        description: err.message || 'Falha ao excluir turma',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleAddClass,
    handleEditClass,
    handleDeleteClass
  };
};
