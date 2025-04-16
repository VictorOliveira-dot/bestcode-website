
import React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  teacherId: z.string().uuid("Professor inválido"),
});

interface Teacher {
  id: string;
  name: string;
}

interface AddClassDialogProps {
  onClassAdded: () => void;
}

const AddClassDialog: React.FC<AddClassDialogProps> = ({ onClassAdded }) => {
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useAuth();

  React.useEffect(() => {
    const fetchTeachers = async () => {
      const { data, error } = await supabase.rpc('admin_get_teachers');
      
      if (error) {
        console.error("Error fetching teachers:", error);
        toast({
          title: "Erro ao carregar professores",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        console.log("Teachers fetched:", data.length);
        setTeachers(data);
      }
    };

    if (isOpen) {
      fetchTeachers();
    }
  }, [isOpen]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date().toISOString().split('T')[0],
      teacherId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log("Creating class with data:", data);
      
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }
      
      console.log("User role:", user.role);
      
      if (user.role !== 'admin') {
        throw new Error("Apenas administradores podem criar turmas");
      }
      
      const { data: result, error } = await supabase.rpc('admin_create_class', {
        p_name: data.name,
        p_description: data.description,
        p_start_date: data.startDate,
        p_teacher_id: data.teacherId
      });

      if (error) {
        console.error("Error creating class:", error);
        throw error;
      }

      toast({
        title: "Turma criada com sucesso",
        description: `A turma ${data.name} foi criada.`,
      });

      form.reset();
      setIsOpen(false);
      onClassAdded();
    } catch (error: any) {
      console.error("Failed to create class:", error);
      toast({
        title: "Erro ao criar turma",
        description: error.message || "Ocorreu um erro ao criar a turma.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setIsOpen(true)}>Adicionar Turma</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Turma</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Turma</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da turma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição da turma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Início</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um professor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassDialog;
