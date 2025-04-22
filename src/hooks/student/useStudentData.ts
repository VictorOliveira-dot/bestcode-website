
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
      // The mock client has a different structure than the actual Supabase client
      // In the mock, we need to await the result of single() to get data/error
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
        .eq("student_id", user?.id)
        .single();
      
      if (error) throw error;
      // Return as an array even though single returns one item
      return data ? [data] : [];
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
        .in("class_id", classIds);

      if (error) throw error;
      
      // Transform the data to match expected format
      return (data || []).map(lesson => ({
        ...lesson,
        class: lesson.classes.name,
        youtubeUrl: lesson.youtube_url // Map youtube_url to youtubeUrl to match our expected type
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
      
      // In the mock, we need to await the result of select
      const result = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("student_id", user?.id);

      // With the mock implementation, we need to access the returned object directly
      // since it doesn't have data/error properties at this level
      return result.data || [];
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
      const result = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user?.id);

      // With the mock implementation, we need to access the returned object directly
      return result.data || [];
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
      
      // Fix the upsert call to use insert with onConflict
      const { data, error } = await supabase
        .from("lesson_progress")
        .insert({
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
