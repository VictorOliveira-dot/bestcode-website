
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth"; 
import { PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

interface AddTeacherDialogProps {
  onTeacherAdded: () => void;
}

const AddTeacherDialog: React.FC<AddTeacherDialogProps> = ({ onTeacherAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar professores.",
        variant: "destructive",
      });
      return;
    }

    // Verificação adicional de campos preenchidos
    if (!data.email || !data.name || !data.password) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Criar o professor apenas na tabela public.users usando a função RPC
      console.log("Chamando RPC admin_create_professor para criar professor com email:", data.email);
      
      const { data: teacherId, error: rpcError } = await supabase.rpc('admin_create_professor', {
        p_email: data.email,
        p_name: data.name,
        p_password: data.password
      });
      
      if (rpcError) {
        console.error("Erro ao criar professor via RPC:", rpcError);
        throw rpcError;
      }

      console.log("Professor criado na tabela public.users com ID:", teacherId);
      
      // Informar que o professor foi criado, mas que precisará ser configurado manualmente
      toast({
        title: "Professor criado com sucesso",
        description: `O professor ${data.name} foi adicionado ao sistema. Um administrador precisará configurar as credenciais de login manualmente no painel do Supabase.`,
      });

      form.reset();
      setIsOpen(false);
      onTeacherAdded(); // Atualiza a lista de professores
    } catch (error: any) {
      console.error("Erro ao criar professor:", error);
      toast({
        title: "Erro ao criar professor",
        description: error.message || "Ocorreu um erro ao criar o professor.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setIsOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Professor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Professor</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do professor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeacherDialog;
