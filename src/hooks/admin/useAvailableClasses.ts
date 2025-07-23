
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

export interface AvailableClass {
  id: string;
  name: string;
  description: string;
  start_date: string;
  teacher_name: string | null;
}

export function useAvailableClasses() {
  const { user, loading: authLoading } = useAuth();

  const { 
    data: availableClasses, 
    isLoading, 
    error,
    refetch 
  } = useQuery<AvailableClass[]>({
    queryKey: ['available-classes'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('admin_get_courses');
        
        if (error) {
          console.error("Failed to fetch available classes:", error);
          throw error;
        }

        // console.log("Available classes fetched successfully:", data?.length || 0);
        
        // Transformar os dados para o formato esperado
        return (data || []).map((course: any) => ({
          id: course.class_id,
          name: course.name,
          description: course.description,
          start_date: course.start_date,
          teacher_name: course.teacher_name
        }));
      } catch (err: any) {
        console.error("Error fetching available classes:", err);
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
    availableClasses: availableClasses || [],
    isLoading,
    error,
    refetch
  };
}
