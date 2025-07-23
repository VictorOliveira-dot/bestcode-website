
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
      console.log("Tentando redefinir senha para:", data.email);
      
      const { data: result, error } = await supabase.rpc('reset_password_send_email', {
        p_email: data.email
      });

      if (error) {
        console.error("Erro ao redefinir senha:", error);
        toast({
          variant: "destructive",
          title: "Erro ao redefinir senha",
          description: error.message === 'Email não encontrado' 
            ? "Email não encontrado no sistema." 
            : "Não foi possível redefinir a senha. Tente novamente."
        });
        return;
      }

      if (result) {
        console.log("Nova senha gerada e enviada com sucesso");
        setResetSent(true);
        toast({
          title: "Nova senha enviada",
          description: "Uma nova senha foi gerada e enviada para seu email."
        });
      }
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível redefinir a senha. Tente novamente."
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
              ? "Uma nova senha foi gerada e enviada para seu email." 
              : "Digite seu email para receber uma nova senha"}
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
                  {isSubmitting ? "Gerando..." : "Gerar Nova Senha"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="py-4">
            <p className="text-center mb-4">Uma nova senha foi gerada e enviada para seu email. Use a nova senha para fazer login.</p>
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
