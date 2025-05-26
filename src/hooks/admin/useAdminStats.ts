
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

export const useAdminStats = () => {
  const { user } = useAuth();

  const { data: activeStudentsCount, isLoading: isLoadingCount } = useQuery({
    queryKey: ["adminActiveStudentsCount"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('admin_get_active_students_count');
      
      if (error) throw error;
      return data as number;
    },
    enabled: user?.role === "admin"
  });

  const { data: allClasses, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["adminAllClasses"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('admin_get_all_classes');
      
      if (error) throw error;
      return data || [];
    },
    enabled: user?.role === "admin"
  });

  return {
    activeStudentsCount: activeStudentsCount || 0,
    allClasses: allClasses || [],
    isLoading: isLoadingCount || isLoadingClasses
  };
};
