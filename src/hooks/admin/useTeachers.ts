
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Teacher {
  id: string;
  name: string;
}

export const useTeachers = (shouldFetch: boolean = false) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching teachers data...");
      
      // Verificar usuário atual
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        throw new Error(`Erro ao obter usuário atual: ${userError.message}`);
      }
      
      console.log("Current user:", userData?.user?.id);
      
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
        console.log("Sample teacher data:", data[0]);
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
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchTeachers();
    }
  }, [shouldFetch]);

  return { teachers, isLoading, fetchTeachers };
};
