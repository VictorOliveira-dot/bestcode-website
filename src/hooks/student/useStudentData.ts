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
      // console.log('🔍 Fetching student enrollments for user:', user?.id);
      
      const { data, error } = await supabase
        .rpc('get_student_enrollments');
      
      if (error) {
        
        throw error;
      }
      
      // console.log('✅ Enrollments fetched:', data);
      return data || [];
    },
    enabled: !!user?.id
  });

  const {
    data: lessons,
    isLoading: isLoadingLessons,
    error: lessonsError
  } = useQuery({
    queryKey: ["studentLessons", user?.id],
    queryFn: async () => {
      // console.log('🔍 Fetching student lessons for user:', user?.id);
      
      // Usar a função que considera o timezone do Brasil
      const { data: studentLessons, error: lessonsError } = await supabase
        .rpc('get_student_lessons_brazil_timezone');
      
      if (lessonsError) {
        
        throw lessonsError;
      }
      
      // console.log('✅ Student lessons with Brazil timezone:', studentLessons);
      
      // Transformar dados para o formato esperado
      const transformedLessons = studentLessons?.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        youtube_url: lesson.youtube_url,
        date: lesson.date,
        class_id: lesson.class_id,
        class_name: lesson.class_name,
        visibility: lesson.visibility,
        scheduled_at_brazil: lesson.scheduled_at_brazil
      })) || [];
      
      // console.log('✅ Final transformed lessons with Brazil timezone:', transformedLessons);
      return transformedLessons;
    },
    enabled: !!user?.id
  });

  const {
    data: progress,
    isLoading: isLoadingProgress,
    error: progressError
  } = useQuery({
    queryKey: ["studentProgress", user?.id],
    queryFn: async () => {
      // console.log('🔍 Fetching student progress for user:', user?.id);
      
      const { data, error } = await supabase
        .rpc('get_student_progress');

      if (error) {
        
        throw error;
      }
      
      // console.log('✅ Progress fetched:', data);
      return data || [];
    },
    enabled: !!user?.id
  });

  const {
    data: notifications,
    isLoading: isLoadingNotifications,
    error: notificationsError
  } = useQuery({
    queryKey: ["studentNotifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_student_notifications', {
          p_user_id: user.id
        });

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
      // console.log('🚀 updateProgressMutation called with:', { 
      //   lessonId, 
      //   watchTimeMinutes, 
      //   progress, 
      //   userId: user?.id 
      // });
      
      if (!user?.id) {
        
        throw new Error('User not authenticated');
      }

      const status = progress >= 100 ? "completed" : progress > 0 ? "in_progress" : "not_started";
      
      // console.log('📊 Calling upsert_lesson_progress with:', {
      //   p_lesson_id: lessonId,
      //   p_student_id: user.id,
      //   p_watch_time_minutes: Math.max(0, Math.floor(watchTimeMinutes)),
      //   p_progress: Math.max(0, Math.min(100, Math.floor(progress))),
      //   p_status: status
      // });
      
      const { data, error } = await supabase.rpc('upsert_lesson_progress', {
        p_lesson_id: lessonId,
        p_student_id: user.id,
        p_watch_time_minutes: Math.max(0, Math.floor(watchTimeMinutes)),
        p_progress: Math.max(0, Math.min(100, Math.floor(progress))),
        p_status: status
      });

      if (error) {
        
        throw error;
      }
      
      // console.log('✅ Progress updated successfully:', data);
      return data;
    },
    onSuccess: (data, variables) => {
      // console.log('✅ Progress update success, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ["studentProgress"] });
      queryClient.invalidateQueries({ queryKey: ["teacherStudentProgress"] });
      
      if (variables.progress >= 100) {
        toast({
          title: "Aula concluída!",
          description: "Parabéns! Você completou esta aula.",
        });
      }
    },
    onError: (error: any, variables) => {
      
      toast({
        title: "Erro",
        description: `Não foi possível atualizar seu progresso: ${error.message || 'Erro desconhecido'}`,
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

  const updateProgress = async (lessonId: string, watchTimeMinutes: number, progress: number) => {
    try {
      // console.log('🔄 updateProgress called with:', { lessonId, watchTimeMinutes, progress });
      return await updateProgressMutation.mutateAsync({ lessonId, watchTimeMinutes, progress });
    } catch (error) {
      
      throw error;
    }
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
