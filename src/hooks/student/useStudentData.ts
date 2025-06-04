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
      
      // Buscar todas as aulas diretamente para debug
      const { data: allLessons, error: allLessonsError } = await supabase
        .from('lessons')
        .select(`
          id,
          title,
          description,
          youtube_url,
          date,
          class_id,
          visibility,
          classes!inner(
            id,
            name
          )
        `);
      
      if (allLessonsError) {
        console.error('❌ Error fetching all lessons:', allLessonsError);
      } else {
        console.log('📚 All lessons in database:', allLessons);
      }
      
      // Buscar matrículas do estudante
      const { data: studentEnrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select(`
          class_id,
          classes!inner(
            id,
            name
          )
        `)
        .eq('student_id', user?.id);
      
      if (enrollError) {
        console.error('❌ Error fetching student enrollments:', enrollError);
        throw enrollError;
      }
      
      console.log('📚 Student enrolled in classes:', studentEnrollments);
      
      if (!studentEnrollments || studentEnrollments.length === 0) {
        console.log('⚠️ Student not enrolled in any classes');
        return [];
      }
      
      const classIds = studentEnrollments.map(e => e.class_id);
      console.log('🎯 Class IDs for student:', classIds);
      
      // Buscar aulas das turmas do estudante + aulas com visibilidade 'all'
      const { data: studentLessons, error: lessonsError } = await supabase
        .from('lessons')
        .select(`
          id,
          title,
          description,
          youtube_url,
          date,
          class_id,
          visibility,
          classes!inner(
            id,
            name
          )
        `)
        .or(`class_id.in.(${classIds.join(',')}),visibility.eq.all`);
      
      if (lessonsError) {
        console.error('❌ Error fetching student lessons:', lessonsError);
        throw lessonsError;
      }
      
      console.log('✅ Student lessons query result:', studentLessons);
      
      // Transformar dados para o formato esperado
      const transformedLessons = studentLessons?.map(lesson => {
        const classInfo = lesson.classes as any;
        
        console.log('🔄 Transforming lesson:', {
          id: lesson.id,
          title: lesson.title,
          class_id: lesson.class_id,
          visibility: lesson.visibility,
          classInfo
        });
        
        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          youtube_url: lesson.youtube_url,
          date: lesson.date,
          class_id: lesson.class_id,
          class_name: classInfo?.name || 'Turma não encontrada',
          visibility: lesson.visibility
        };
      }) || [];
      
      console.log('✅ Final transformed lessons:', transformedLessons);
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
