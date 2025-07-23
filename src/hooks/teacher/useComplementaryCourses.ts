
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";

export interface ComplementaryCourse {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  created_at: string;
  is_active: boolean;
}

export interface CreateCourseData {
  title: string;
  description: string;
  youtubeUrl: string;
}

export const useComplementaryCourses = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: courses = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["teacherComplementaryCourses", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.error("No user ID available for querying complementary courses");
        return [];
      }
      
      // console.log("Fetching complementary courses for teacher ID:", user.id);
      
      try {
        const { data, error } = await supabase.rpc('get_teacher_complementary_courses', {
          p_teacher_id: user.id
        });

        if (error) {
          console.error("Error fetching teacher complementary courses:", error);
          throw error;
        }
        
        // console.log("Fetched complementary courses:", data);
        return data || [];
      } catch (err) {
        console.error("Failed to fetch complementary courses:", err);
        throw err;
      }
    },
    enabled: !!user?.id,
    staleTime: 30000,
    gcTime: 1000 * 60 * 5,
  });

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: CreateCourseData) => {
      if (!user?.id) {
        throw new Error("User ID not available");
      }

      const { data, error } = await supabase.rpc('create_complementary_course', {
        p_title: courseData.title,
        p_description: courseData.description,
        p_youtube_url: courseData.youtubeUrl,
        p_teacher_id: user.id
      });

      if (error) {
        console.error("Error creating complementary course:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Curso criado",
        description: "O curso complementar foi criado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["teacherComplementaryCourses", user?.id] });
    },
    onError: (error: any) => {
      console.error("Error creating complementary course:", error);
      toast({
        title: "Erro ao criar curso",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  });

  const updateCourseMutation = useMutation({
    mutationFn: async ({ courseId, courseData }: { courseId: string, courseData: CreateCourseData }) => {
      if (!user?.id) {
        throw new Error("User ID not available");
      }

      const { error } = await supabase.rpc('update_complementary_course', {
        p_course_id: courseId,
        p_title: courseData.title,
        p_description: courseData.description,
        p_youtube_url: courseData.youtubeUrl,
        p_teacher_id: user.id
      });

      if (error) {
        console.error("Error updating complementary course:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Curso atualizado",
        description: "O curso complementar foi atualizado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["teacherComplementaryCourses", user?.id] });
    },
    onError: (error: any) => {
      console.error("Error updating complementary course:", error);
      toast({
        title: "Erro ao atualizar curso",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user?.id) {
        throw new Error("User ID not available");
      }

      const { error } = await supabase.rpc('delete_complementary_course', {
        p_course_id: courseId,
        p_teacher_id: user.id
      });

      if (error) {
        console.error("Error deleting complementary course:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Curso excluído",
        description: "O curso complementar foi excluído com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["teacherComplementaryCourses", user?.id] });
    },
    onError: (error: any) => {
      console.error("Error deleting complementary course:", error);
      toast({
        title: "Erro ao excluir curso",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  });

  return {
    courses,
    isLoading,
    error,
    refetch,
    createCourse: createCourseMutation.mutate,
    updateCourse: updateCourseMutation.mutate,
    deleteCourse: deleteCourseMutation.mutate,
    isCreating: createCourseMutation.isPending,
    isUpdating: updateCourseMutation.isPending,
    isDeleting: deleteCourseMutation.isPending
  };
};
