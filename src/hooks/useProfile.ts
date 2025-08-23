import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

interface UpdateProfileData {
  name?: string;
  bio?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface ChangeEmailData {
  newEmail: string;
  password: string;
}

export const useProfile = () => {
  const { user } = useAuth();

  // Atualizar perfil
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      if (!user?.id) throw new Error("Usuário não autenticado");

      const { error } = await supabase.rpc('update_user_profile', {
        p_user_id: user.id,
        p_name: data.name || null,
        p_bio: data.bio || null
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Alterar senha
  const { mutateAsync: changePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao alterar senha",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Alterar email
  const { mutateAsync: changeEmail, isPending: isChangingEmail } = useMutation({
    mutationFn: async (data: ChangeEmailData) => {
      const { error } = await supabase.auth.updateUser({
        email: data.newEmail
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Email alterado",
        description: "Um email de confirmação foi enviado para o novo endereço.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao alterar email",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    updateProfile,
    changePassword,
    changeEmail,
    isUpdatingProfile,
    isChangingPassword,
    isChangingEmail
  };
};