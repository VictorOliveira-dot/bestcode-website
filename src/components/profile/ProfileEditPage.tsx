import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/contexts/auth";
import { useProfile } from "@/hooks/useProfile";
import { ArrowLeft, User, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProfileFormData {
  name: string;
  bio: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface EmailFormData {
  newEmail: string;
  password: string;
}

const ProfileEditPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    updateProfile, 
    changePassword, 
    changeEmail,
    isUpdatingProfile,
    isChangingPassword,
    isChangingEmail
  } = useProfile();

  const profileForm = useForm<ProfileFormData>();
  const passwordForm = useForm<PasswordFormData>();
  const emailForm = useForm<EmailFormData>();

  useEffect(() => {
    if (user) {
      // Buscar dados do perfil do banco
      const fetchUserProfile = async () => {
        try {
          const { data } = await supabase
            .from('users')
            .select('name, bio, email')
            .eq('id', user.id)
            .single();
          
          if (data) {
            profileForm.setValue('name', data.name || '');
            profileForm.setValue('bio', data.bio || '');
            emailForm.setValue('newEmail', data.email || '');
          }
        } catch (error) {
          console.error('Erro ao carregar perfil:', error);
          // Fallback para dados do user
          profileForm.setValue('name', user.name || '');
          profileForm.setValue('bio', '');
          emailForm.setValue('newEmail', user.email || '');
        }
      };
      
      fetchUserProfile();
    }
  }, [user]);

  const onUpdateProfile = async (data: ProfileFormData) => {
    await updateProfile(data);
  };

  const onChangePassword = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      passwordForm.setError('confirmPassword', {
        message: 'As senhas não coincidem'
      });
      return;
    }

    await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });

    passwordForm.reset();
  };

  const onChangeEmail = async (data: EmailFormData) => {
    await changeEmail({
      newEmail: data.newEmail,
      password: data.password
    });

    emailForm.reset();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-custom py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (user?.role === 'admin') {
                navigate('/admin/dashboard');
              } else if (user?.role === 'teacher') {
                navigate('/teacher/dashboard');
              } else {
                navigate('/student/dashboard');
              }
            }}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          </div>
          <div className="text-start">
            <h1 className="text-2xl font-bold">Editar Perfil</h1>
            <p className="text-muted-foreground mt-3">
              Gerencie suas informações pessoais, senha e email
            </p>
        </div>

        <div className="grid gap-6 max-w-4xl mt-4">
          {/* Informações do Perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Atualize suas informações básicas de perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    {...profileForm.register('name', { required: 'Nome é obrigatório' })}
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Bio Section - Uncommented */}
                <div>
                  <Label htmlFor="bio">Descrição (opcional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Conte um pouco sobre você..."
                    {...profileForm.register('bio')}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isUpdatingProfile}
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
                >
                  {isUpdatingProfile ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Alterar Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email
              </CardTitle>
              <CardDescription>
                Altere seu endereço de email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={emailForm.handleSubmit(onChangeEmail)} className="space-y-4">
                <div>
                  <Label htmlFor="current-email">Email atual</Label>
                  <Input
                    id="current-email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div>
                  <Label htmlFor="new-email">Novo email</Label>
                  <Input
                    id="new-email"
                    type="email"
                    {...emailForm.register('newEmail', { 
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
                  />
                  {emailForm.formState.errors.newEmail && (
                    <p className="text-sm text-destructive mt-1">
                      {emailForm.formState.errors.newEmail.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email-password">Senha atual para confirmação</Label>
                  <PasswordInput
                    id="email-password"
                    {...emailForm.register('password', { required: 'Senha é obrigatória' })}
                  />
                  {emailForm.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {emailForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isChangingEmail}
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
                >
                  {isChangingEmail ? 'Alterando...' : 'Alterar Email'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Alterar Senha */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Senha
              </CardTitle>
              <CardDescription>
                Altere sua senha de acesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Senha atual</Label>
                  <PasswordInput
                    id="current-password"
                    {...passwordForm.register('currentPassword', { required: 'Senha atual é obrigatória' })}
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-destructive mt-1">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="new-password">Nova senha</Label>
                  <PasswordInput
                    id="new-password"
                    {...passwordForm.register('newPassword', { 
                      required: 'Nova senha é obrigatória',
                      minLength: {
                        value: 6,
                        message: 'A senha deve ter pelo menos 6 caracteres'
                      }
                    })}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-destructive mt-1">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                  <PasswordInput
                    id="confirm-password"
                    {...passwordForm.register('confirmPassword', { required: 'Confirmação de senha é obrigatória' })}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isChangingPassword}
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
                >
                  {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;