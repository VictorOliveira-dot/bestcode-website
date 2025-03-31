
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

// Esquema de validação
const forgotPasswordSchema = z.object({
  email: z.string().email("Digite um e-mail válido")
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializa o formulário
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulação de envio de e-mail de recuperação
      // Em um app real, isso seria conectado a um backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "E-mail enviado",
        description: `Instruções de recuperação de senha foram enviadas para ${data.email}`,
      });
      
      form.reset();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar e-mail",
        description: "Não foi possível enviar o e-mail de recuperação. Tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Recuperação de Senha</DialogTitle>
          <DialogDescription className="text-center">
            Digite seu e-mail para receber instruções de recuperação de senha
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
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
                onClick={onClose}
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
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
