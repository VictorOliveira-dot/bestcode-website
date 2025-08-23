import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Enviar notificação para turma específica
  const { mutateAsync: sendNotificationToClass, isPending: isSendingToClass } = useMutation({
    mutationFn: async ({ 
      title, 
      message, 
      classId 
    }: { 
      title: string; 
      message: string; 
      classId: string; 
    }) => {
      if (!user?.id) throw new Error("Usuário não autenticado");

      const { error } = await supabase.rpc('send_notification_to_class', {
        p_title: title,
        p_message: message,
        p_class_id: classId,
        p_sender_id: user.id
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentNotifications'] });
      toast({
        title: "Notificação enviada",
        description: "A notificação foi enviada para todos os alunos da turma.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao enviar notificação",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Enviar notificação para todas as turmas
  const { mutateAsync: sendNotificationToAllClasses, isPending: isSendingToAll } = useMutation({
    mutationFn: async ({ 
      title, 
      message 
    }: { 
      title: string; 
      message: string; 
    }) => {
      if (!user?.id) throw new Error("Usuário não autenticado");

      const { error } = await supabase.rpc('send_notification_to_all_classes', {
        p_title: title,
        p_message: message,
        p_sender_id: user.id
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentNotifications'] });
      toast({
        title: "Notificação enviada",
        description: "A notificação foi enviada para todos os alunos.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao enviar notificação",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    sendNotificationToClass,
    sendNotificationToAllClasses,
    isSendingToClass,
    isSendingToAll
  };
};