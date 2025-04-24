
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Course {
  id: string;
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
      // Log the query execution to help with debugging
      console.log("Fetching courses from Supabase...");
      
      const { data, error } = await supabase
        .rpc('admin_get_courses');

      if (error) {
        console.error("Error fetching courses:", error);
        throw error;
      }

      console.log("Courses fetched successfully:", data);
      return data as Course[];
    }
  });
};
