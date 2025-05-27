
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
      console.log("Fetching student enrollments");
      const { data, error } = await supabase.rpc('get_student_enrollments');
      
      if (error) {
        console.error("Error fetching enrollments:", error);
        throw error;
      }
      console.log("Fetched enrollments:", data);
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 30000,
    gcTime: 1000 * 60 * 5
  });

  const {
    data: lessons,
    isLoading: isLoadingLessons,
    error: lessonsError
  } = useQuery({
    queryKey: ["studentLessons", user?.id],
    queryFn: async () => {
      console.log("Fetching student lessons");
      const { data, error } = await supabase.rpc('get_student_lessons');

      if (error) {
        console.error("Error fetching lessons:", error);
        throw error;
      }
      console.log("Fetched lessons:", data);
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 30000,
    gcTime: 1000 * 60 * 5
  });

  const {
    data: progress,
    isLoading: isLoadingProgress,
    error: progressError
  } = useQuery({
    queryKey: ["studentProgress", user?.id],
    queryFn: async () => {
      console.log("Fetching student progress");
      const { data, error } = await supabase.rpc('get_student_progress');

      if (error) {
        console.error("Error fetching progress:", error);
        throw error;
      }
      console.log("Fetched progress:", data);
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 30000,
    gcTime: 1000 * 60 * 5
  });

  const {
    data: notifications,
    isLoading: isLoadingNotifications,
    error: notificationsError
  } = useQuery({
    queryKey: ["studentNotifications", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log("Fetching student notifications");
      const { data, error } = await supabase.rpc('get_student_notifications', {
        p_user_id: user.id
      });

      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
      console.log("Fetched notifications:", data);
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 30000,
    gcTime: 1000 * 60 * 5
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ lessonId, watchTimeMinutes, progress }: { 
      lessonId: string, 
      watchTimeMinutes: number, 
      progress: number 
    }) => {
      const status = progress >= 100 ? "completed" : progress > 0 ? "in_progress" : "not_started";
      
      const result = await supabase
        .from("lesson_progress")
        .upsert({
          lesson_id: lessonId,
          student_id: user?.id,
          watch_time_minutes: watchTimeMinutes,
          progress,
          last_watched: new Date().toISOString(),
          status
        });

      if (result.error) throw result.error;
      return result.data;
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

  const markNotificationAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .rpc('mark_notification_as_read', {
          p_notification_id: notificationId
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentNotifications"] });
      toast({
        title: "Notificação atualizada",
        description: "Notificação marcada como lida"
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível marcar a notificação como lida",
        variant: "destructive"
      });
    }
  });

  const updateProgress = (lessonId: string, watchTimeMinutes: number, progress: number) => {
    return updateProgressMutation.mutateAsync({ lessonId, watchTimeMinutes, progress });
  };

  const markNotificationAsRead = (notificationId: string) => {
    return markNotificationAsReadMutation.mutateAsync(notificationId);
  };

  return {
    enrollments,
    lessons,
    progress,
    notifications,
    isLoading: isLoadingEnrollments || isLoadingLessons || isLoadingProgress || isLoadingNotifications,
    error: enrollmentsError || lessonsError || progressError || notificationsError,
    updateProgress,
    markNotificationAsRead
  };
};
