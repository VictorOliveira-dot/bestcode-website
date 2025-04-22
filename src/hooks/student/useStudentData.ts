
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";

export const useStudentData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: enrollments,
    isLoading: isLoadingEnrollments,
    error: enrollmentsError
  } = useQuery({
    queryKey: ["studentEnrollments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          id,
          class_id,
          classes (
            id,
            name,
            description,
            start_date,
            teacher_id
          )
        `)
        .eq("student_id", user?.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  const {
    data: lessons,
    isLoading: isLoadingLessons,
    error: lessonsError
  } = useQuery({
    queryKey: ["studentLessons", enrollments],
    queryFn: async () => {
      if (!enrollments?.length) return [];
      
      const classIds = enrollments.map(e => e.class_id);
      
      const { data, error } = await supabase
        .from("lessons")
        .select("*, classes(name)")
        .in("class_id", classIds)
        .order("date", { ascending: true });

      if (error) throw error;
      
      // Transform the data to match expected format
      return (data || []).map(lesson => ({
        ...lesson,
        class: lesson.classes.name
      }));
    },
    enabled: !!enrollments?.length
  });

  const {
    data: progress,
    isLoading: isLoadingProgress,
    error: progressError
  } = useQuery({
    queryKey: ["studentProgress", lessons],
    queryFn: async () => {
      if (!lessons?.length) return [];
      
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("student_id", user?.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!lessons?.length
  });

  const {
    data: notifications,
    isLoading: isLoadingNotifications,
    error: notificationsError
  } = useQuery({
    queryKey: ["studentNotifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ lessonId, watchTimeMinutes, progress }: { 
      lessonId: string, 
      watchTimeMinutes: number, 
      progress: number 
    }) => {
      const status = progress >= 100 ? "completed" : progress > 0 ? "in_progress" : "not_started";
      
      const { data, error } = await supabase
        .from("lesson_progress")
        .upsert({
          lesson_id: lessonId,
          student_id: user?.id,
          watch_time_minutes: watchTimeMinutes,
          progress,
          last_watched: new Date().toISOString(),
          status
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentProgress"] });
      toast({
        title: "Progresso atualizado",
        description: "Seu progresso foi atualizado com sucesso"
      });
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar progresso:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seu progresso",
        variant: "destructive"
      });
    }
  });

  const updateProgress = (lessonId: string, watchTimeMinutes: number, progress: number) => {
    return updateProgressMutation.mutateAsync({ lessonId, watchTimeMinutes, progress });
  };

  return {
    enrollments,
    lessons,
    progress,
    notifications,
    isLoading: isLoadingEnrollments || isLoadingLessons || isLoadingProgress || isLoadingNotifications,
    error: enrollmentsError || lessonsError || progressError || notificationsError,
    updateProgress
  };
};
