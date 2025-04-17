
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Teacher {
  id: string;
  name: string;
}

export const useTeachers = (shouldFetch: boolean = false) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTeachers = useCallback(async () => {
    if (!shouldFetch) return;
    
    setIsLoading(true);
    try {
      console.log("Fetching teachers data...");
      
      // Ensure we have a valid session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Erro ao verificar sessão: ${sessionError.message}`);
      }
      
      let session = sessionData.session;
      
      if (!session) {
        // Try to refresh the session
        console.log("No active session, attempting to refresh...");
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          throw new Error(`Erro ao atualizar sessão: ${refreshError.message}`);
        }
        
        session = refreshData.session;
        
        if (!session) {
          throw new Error("Sessão não encontrada ou expirada. Por favor, faça login novamente.");
        }
        
        console.log("Session refreshed successfully");
      }
      
      console.log("Session verified, user ID:", session.user.id);
      
      const { data, error } = await supabase.rpc('admin_get_teachers');
      
      if (error) {
        console.error("Error fetching teachers:", error);
        toast({
          title: "Erro ao carregar professores",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        console.log("Teachers fetched successfully:", data.length);
        if (data.length > 0) {
          console.log("Sample teacher data:", data[0]);
        }
        setTeachers(data);
      }
    } catch (error: any) {
      console.error("Failed to fetch teachers:", error);
      toast({
        title: "Erro ao carregar professores",
        description: error.message || "Ocorreu um erro ao carregar os professores",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [shouldFetch]);

  useEffect(() => {
    if (shouldFetch) {
      fetchTeachers();
    }
  }, [shouldFetch, fetchTeachers]);

  return { teachers, isLoading, fetchTeachers };
};
