import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

export interface TeacherNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  sent_to_class?: string;
  sent_to_all?: boolean;
}

export const useTeacherNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query to get notifications sent by the teacher
  const {
    data: notifications = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["teacherNotifications", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          title,
          message,
          date,
          created_at
        `)
        .eq('sender_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // Cache for 2 minutes
  });

  // Mutation to delete notification
  const { mutateAsync: deleteNotification } = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('sender_id', user?.id); // Ensure teacher can only delete their own

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherNotifications'] });
      toast({
        title: "Notificação excluída",
        description: "A notificação foi excluída com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir notificação",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation to edit notification
  const { mutateAsync: editNotification } = useMutation({
    mutationFn: async ({ 
      notificationId, 
      title, 
      message 
    }: { 
      notificationId: string; 
      title: string; 
      message: string; 
    }) => {
      const { error } = await supabase
        .from('notifications')
        .update({
          title,
          message,
          updated_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .eq('sender_id', user?.id); // Ensure teacher can only edit their own

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherNotifications'] });
      toast({
        title: "Notificação atualizada",
        description: "A notificação foi atualizada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar notificação",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    notifications,
    isLoading,
    error,
    deleteNotification,
    editNotification
  };
};