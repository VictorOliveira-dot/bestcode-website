
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface RevenueData {
  class_id: string | null;
  class_name: string;
  total_revenue: number;
  total_students: number;
  month_date: string | null;
}

export interface RevenueFilters {
  groupBy?: 'all' | 'month' | 'class';
  startDate?: string;
  endDate?: string;
}

export const useRevenue = (filters: RevenueFilters = {}) => {
  return useQuery({
    queryKey: ['admin-revenue', filters],
    queryFn: async () => {
      // console.log("Fetching revenue data with filters:", filters);
      
      const { data, error } = await supabase.rpc('admin_get_revenue_data', {
        p_group_by: filters.groupBy || 'all',
        p_start_date: filters.startDate,
        p_end_date: filters.endDate
      });

      if (error) {
        
        throw error;
      }

      // console.log("Revenue data fetched successfully:", data);
      return data as RevenueData[];
    }
  });
};
