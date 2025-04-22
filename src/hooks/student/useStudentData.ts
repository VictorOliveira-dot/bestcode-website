
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";

export const useStudentData = () => {
  const { user } = useAuth();

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
      return data;
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
        .select("*")
        .in("class_id", classIds)
        .order("date", { ascending: true });

      if (error) throw error;
      return data;
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
      return data;
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
      return data;
    },
    enabled: !!user?.id
  });

  const updateProgress = async (lessonId: string, watchTimeMinutes: number, progress: number) => {
    try {
      const { error } = await supabase
        .from("lesson_progress")
        .upsert({
          lesson_id: lessonId,
          student_id: user?.id,
          watch_time_minutes: watchTimeMinutes,
          progress,
          last_watched: new Date().toISOString(),
          status: progress >= 100 ? "completed" : progress > 0 ? "in_progress" : "not_started"
        });

      if (error) throw error;

      toast({
        title: "Progresso atualizado",
        description: `Seu progresso foi atualizado para ${progress}%`
      });
    } catch (error: any) {
      console.error("Erro ao atualizar progresso:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seu progresso",
        variant: "destructive"
      });
    }
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
