
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ClassFormValues } from "@/components/admin/class/ClassForm";

export const useClassCreation = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const createClass = async (data: ClassFormValues) => {
    try {
      setIsLoading(true);
      console.log("Creating class with data:", data);
      
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }
      
      console.log("User role:", user.role);
      console.log("User ID:", user.id);
      
      // Verificação adicional para garantir que é um admin
      if (user.role !== 'admin') {
        toast({
          title: "Acesso negado",
          description: "Apenas administradores podem criar turmas.",
          variant: "destructive",
        });
        return false;
      }
      
      const { data: result, error } = await supabase.rpc('admin_create_class', {
        p_name: data.name,
        p_description: data.description,
        p_start_date: data.startDate,
        p_teacher_id: data.teacherId
      });

      if (error) {
        console.error("Error creating class:", error);
        throw error;
      }

      toast({
        title: "Turma criada com sucesso",
        description: `A turma ${data.name} foi criada.`,
      });

      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error: any) {
      console.error("Failed to create class:", error);
      toast({
        title: "Erro ao criar turma",
        description: error.message || "Ocorreu um erro ao criar a turma.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { createClass, isLoading };
};
