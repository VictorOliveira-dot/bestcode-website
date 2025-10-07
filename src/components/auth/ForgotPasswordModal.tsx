
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

// Esquema de validação
const resetPasswordSchema = z.object({
  email: z.string().email("Digite um email válido"),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Call RPC function with proper error handling
      const { data: token, error: tokenError } = await supabase
        .rpc('create_password_reset_token', { p_email: data.email });

      if (tokenError) {
        console.error('RPC Error:', tokenError);
        throw new Error(tokenError.message || 'Erro ao criar token de recuperação');
      }

      if (!token) {
        throw new Error('Token não foi gerado');
      }

      // Send email with the token
      const { error: emailError } = await supabase.functions.invoke('send-reset-password-email', {
        body: {
          email: data.email,
          token: token
        }
      });

      if (emailError) {
        console.error('Email Error:', emailError);
        throw new Error('Erro ao enviar email de recuperação');
      }

      setResetSent(true);
      toast({
        title: "Email enviado com sucesso",
        description: "Enviamos um email com as instruções para redefinir sua senha. Verifique sua caixa de entrada."
      });
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar email",
        description: error.message === 'Email não encontrado' 
          ? "Email não encontrado no sistema." 
          : error.message || "Não foi possível enviar o email. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setResetSent(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Redefinição de Senha</DialogTitle>
          <DialogDescription className="text-center">
            {resetSent 
              ? "Enviamos um email com as instruções para redefinir sua senha." 
              : "Digite seu email para receber o link de redefinição de senha"}
          </DialogDescription>
        </DialogHeader>
        
        {!resetSent ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <span className="inline-flex items-center border border-r-0 border-input bg-muted px-3 rounded-l-md">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </span>
                        <Input 
                          placeholder="seu@email.com" 
                          className="rounded-l-none"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-bestcode-600 hover:bg-bestcode-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Link"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="py-4">
            <p className="text-center mb-4">Verifique sua caixa de entrada e siga as instruções no email.</p>
            <div className="flex justify-center">
              <Button onClick={handleClose}>Fechar</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
