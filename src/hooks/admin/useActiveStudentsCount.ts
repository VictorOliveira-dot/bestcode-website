
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

export function useActiveStudentsCount() {
  const { user, loading: authLoading } = useAuth();

  const { 
    data: activeStudentsCount, 
    isLoading, 
    error 
  } = useQuery<number>({
    queryKey: ['active-students-count'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('admin_get_active_students_count');
        
        if (error) {
          throw error;
        }

        return data || 0;
      } catch (err: any) {
        toast({
          title: "Erro ao carregar contagem de alunos",
          description: err.message || "Não foi possível carregar a contagem de alunos ativos",
          variant: "destructive"
        });
        throw err;
      }
    },
    enabled: !authLoading && user?.role === 'admin'
  });

  return {
    activeStudentsCount: activeStudentsCount || 0,
    isLoading,
    error
  };
}
