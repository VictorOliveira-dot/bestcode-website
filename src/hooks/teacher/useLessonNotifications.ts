
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useLessonNotifications = () => {
  const queryClient = useQueryClient();

  const createLessonNotification = useMutation({
    mutationFn: async ({ 
      lessonTitle, 
      className, 
      classId 
    }: { 
      lessonTitle: string; 
      className: string; 
      classId: string; 
    }) => {
      // Get all students enrolled in this class
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('student_id')
        .eq('class_id', classId)
        .eq('status', 'active');

      if (enrollmentsError) throw enrollmentsError;

      if (enrollments && enrollments.length > 0) {
        // Create notifications for all enrolled students
        const notifications = enrollments.map(enrollment => ({
          title: 'Nova aula disponível',
          message: `A aula "${lessonTitle}" foi adicionada à turma ${className}`,
          user_id: enrollment.student_id,
          date: new Date().toISOString()
        }));

        const { error: notificationError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (notificationError) throw notificationError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentNotifications'] });
    },
    onError: (error) => {
      console.error('Erro ao criar notificações:', error);
    }
  });

  return {
    createLessonNotification: createLessonNotification.mutateAsync
  };
};
