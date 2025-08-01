
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

export interface ClassData {
  class_id: string;
  class_name: string;
  teacher_name: string;
  start_date: string;
}

export function useAllClasses() {
  const { user, loading: authLoading } = useAuth();

  const { 
    data: allClasses, 
    isLoading, 
    error 
  } = useQuery<ClassData[]>({
    queryKey: ['all-classes'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('admin_get_all_classes');
        
        if (error) {
          console.error("Failed to fetch all classes:", error);
          throw error;
        }

        // console.log("All classes fetched successfully:", data?.length || 0);
        return data || [];
      } catch (err: any) {
        console.error("Error fetching all classes:", err);
        toast({
          title: "Erro ao carregar turmas",
          description: err.message || "Não foi possível carregar as turmas disponíveis",
          variant: "destructive"
        });
        throw err;
      }
    },
    enabled: !authLoading && user?.role === 'admin'
  });

  return {
    allClasses: allClasses || [],
    isLoading,
    error
  };
}
