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
      console.log('🔍 Fetching student enrollments for user:', user?.id);
      
      const { data, error } = await supabase
        .rpc('get_student_enrollments');
      
      if (error) {
        console.error('❌ Error fetching enrollments:', error);
        throw error;
      }
      
      console.log('✅ Enrollments fetched:', data);
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
      console.log('🔍 Fetching student lessons for user:', user?.id);
      
      // Buscar todas as aulas disponíveis para o estudante
      const { data, error } = await supabase
        .rpc('get_student_lessons');

      if (error) {
        console.error('❌ Error fetching lessons:', error);
        throw error;
      }
      
      console.log('✅ Lessons fetched from database:', data);
      
      // Se não conseguir pelas funções RPC, tentar query direta
      if (!data || data.length === 0) {
        console.log('🔄 Trying direct query for lessons...');
        
        // Buscar aulas diretamente das tabelas
        const { data: directLessons, error: directError } = await supabase
          .from('lessons')
          .select(`
            id,
            title,
            description,
            youtube_url,
            date,
            class_id,
            visibility,
            classes:class_id (
              id,
              name,
              enrollments!inner (
                student_id
              )
            )
          `)
          .eq('classes.enrollments.student_id', user?.id);
        
        if (directError) {
          console.error('❌ Error in direct lessons query:', directError);
          throw directError;
        }
        
        console.log('✅ Direct lessons query result:', directLessons);
        
        // Transformar dados para o formato esperado
        const transformedLessons = directLessons?.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          youtube_url: lesson.youtube_url,
          date: lesson.date,
          class_id: lesson.class_id,
          class_name: lesson.classes?.name || 'Turma não encontrada',
          visibility: lesson.visibility
        })) || [];
        
        console.log('✅ Transformed lessons:', transformedLessons);
        return transformedLessons;
      }
      
      return data || [];
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
      console.log('🔍 Fetching student progress for user:', user?.id);
      
      const { data, error } = await supabase
        .rpc('get_student_progress');

      if (error) {
        console.error('❌ Error fetching progress:', error);
        throw error;
      }
      
      console.log('✅ Progress fetched:', data);
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
      console.log('🚀 updateProgressMutation called with:', { 
        lessonId, 
        watchTimeMinutes, 
        progress, 
        userId: user?.id 
      });
      
      if (!user?.id) {
        console.error('❌ User not authenticated');
        throw new Error('User not authenticated');
      }

      const status = progress >= 100 ? "completed" : progress > 0 ? "in_progress" : "not_started";
      
      console.log('📊 Calling upsert_lesson_progress with:', {
        p_lesson_id: lessonId,
        p_student_id: user.id,
        p_watch_time_minutes: Math.max(0, Math.floor(watchTimeMinutes)),
        p_progress: Math.max(0, Math.min(100, Math.floor(progress))),
        p_status: status
      });
      
      const { data, error } = await supabase.rpc('upsert_lesson_progress', {
        p_lesson_id: lessonId,
        p_student_id: user.id,
        p_watch_time_minutes: Math.max(0, Math.floor(watchTimeMinutes)),
        p_progress: Math.max(0, Math.min(100, Math.floor(progress))),
        p_status: status
      });

      if (error) {
        console.error('❌ Supabase RPC error:', error);
        throw error;
      }
      
      console.log('✅ Progress updated successfully:', data);
      return data;
    },
    onSuccess: (data, variables) => {
      console.log('✅ Progress update success, invalidating queries');
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
      console.error("❌ Erro ao atualizar progresso:", error);
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
      console.log('🔄 updateProgress called with:', { lessonId, watchTimeMinutes, progress });
      return await updateProgressMutation.mutateAsync({ lessonId, watchTimeMinutes, progress });
    } catch (error) {
      console.error('❌ Error in updateProgress:', error);
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
