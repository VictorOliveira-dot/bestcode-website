
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Course {
  class_id: string;
  name: string;
  description: string;
  start_date: string;
  teacher_name: string;
  students_count: number;
  is_active: boolean;
}

export const useCourses = () => {
  return useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('admin_get_courses');

      if (error) {
        throw error;
      }

      return data as Course[];
    }
  });
};
