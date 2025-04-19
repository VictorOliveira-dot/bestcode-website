import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { ClassFormValues } from "@/components/admin/class/ClassForm";

export const useClassCreation = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Log user information whenever it changes
  useEffect(() => {
    if (user) {
      console.log("User in useClassCreation:", user.id);
      console.log("User role:", user.role);
    }
  }, [user]);

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
      
      // Verificar sessão atual
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error getting session:", sessionError);
        throw sessionError;
      }
      
      let session = sessionData.session;
      
      if (!session) {
        console.log("No active session, attempting to refresh...");
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error("Error refreshing session:", refreshError);
          throw new Error("Sessão expirada. Por favor, faça login novamente.");
        }
        
        session = refreshData.session;
        
        if (!session) {
          throw new Error("Sessão não encontrada após tentativa de atualização. Por favor, faça login novamente.");
        }
        
        console.log("Session refreshed successfully");
      }
      
      console.log("Session verified:", session.user.id);
      
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

      console.log("Class created successfully:", result);
      
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
