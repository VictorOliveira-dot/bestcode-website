import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";
import { Lesson } from "@/components/student/types/lesson";

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

      // Transform the data to ensure we have a consistent structure
      return data ? data.map(enrollment => {
        // Correctly access the classes object for each enrollment
        const classData = enrollment.classes || {};
        
        return {
          id: enrollment.id,
          class_id: enrollment.class_id,
          name: classData.name || '',
          description: classData.description || '',
          start_date: classData.start_date || '',
          teacher_id: classData.teacher_id || null
        };
      }) : [];
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
      
      return (data || []).map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        youtubeUrl: lesson.youtube_url,
        date: lesson.date,
        class: lesson.classes.name,
        class_id: lesson.class_id,
        visibility: lesson.visibility as 'all' | 'class_only'
      }));
    },
    enabled: !!enrollments?.length
  });

  const {
    data: progress,
    isLoading: isLoadingProgress,
    error: progressError
  } = useQuery({
    queryKey: ["studentProgress", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase.rpc('get_student_progress', {
        student_id: user.id
      });

      if (error) throw error;
      
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
      if (!user?.id) return [];
      
      const { data, error } = await supabase.rpc('get_student_notifications', {
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
