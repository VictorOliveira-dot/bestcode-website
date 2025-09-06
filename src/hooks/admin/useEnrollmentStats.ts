
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

export interface EnrollmentStat {
  month: string;
  year: number;
  count: number;
  enrollment_date: string;
}

export const useEnrollmentStats = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: enrollmentStats, isLoading, error } = useQuery({
    queryKey: ['enrollment-stats'],
    queryFn: async () => {
      try {
        // console.log("Fetching enrollment statistics");
        
        // Buscar dados dos últimos 12 meses
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 11);
        startDate.setDate(1);
        
        const endDate = new Date();
        
        const { data, error } = await supabase.rpc('admin_get_enrollment_stats', {
          p_start_date: startDate.toISOString().split('T')[0],
          p_end_date: endDate.toISOString().split('T')[0]
        });

        if (error) {
          console.error("Error fetching enrollment stats:", error);
          throw error;
        }

        // console.log("Enrollment stats fetched:", data);
        
        // Processar dados para formato do gráfico - agrupar por mês
        const monthlyData = new Map();
        
        data?.forEach((item: any) => {
          const date = new Date(item.enrollment_date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
          const year = date.getFullYear();
          
          if (monthlyData.has(monthKey)) {
            monthlyData.get(monthKey).count += item.total_enrollments;
          } else {
            monthlyData.set(monthKey, {
              month: monthName,
              year: year,
              count: item.total_enrollments,
              enrollment_date: item.enrollment_date
            });
          }
        });

        const processedData = Array.from(monthlyData.values()).sort((a, b) => 
          new Date(a.enrollment_date).getTime() - new Date(b.enrollment_date).getTime()
        );

        return processedData;
      } catch (err: any) {
        console.error("Error fetching enrollment stats:", err);
        toast({
          title: "Erro ao carregar estatísticas",
          description: err.message || "Não foi possível carregar as estatísticas de matrícula",
          variant: "destructive"
        });
        throw err;
      }
    },
    enabled: !authLoading && user?.role === 'admin'
  });

  return {
    enrollmentStats: enrollmentStats || [],
    isLoading,
    error
  };
};
