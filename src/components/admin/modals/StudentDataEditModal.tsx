import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { validateCPF, formatCPF, validateBrazilianPhone, formatBrazilianPhone } from "@/utils/cpfUtils";
import { MaskedInput } from "@/components/ui/masked-input";

interface StudentDataEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentDetails: {
    user_id: string;
    name: string;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    whatsapp?: string;
    cpf?: string;
    birth_date?: string;
    address?: string;
    education?: string;
    professional_area?: string;
    experience_level?: string;
    goals?: string;
    study_availability?: string;
  } | null;
}

export function StudentDataEditModal({ isOpen, onClose, studentDetails }: StudentDataEditModalProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      whatsapp: "",
      cpf: "",
      birth_date: "",
      address: "",
      education: "",
      professional_area: "",
      experience_level: "",
      goals: "",
      study_availability: "",
    }
  });

  useEffect(() => {
    if (isOpen && studentDetails) {
      form.reset({
        name: studentDetails.name || "",
        email: studentDetails.email || "",
        first_name: studentDetails.first_name || "",
        last_name: studentDetails.last_name || "",
        phone: studentDetails.phone || "",
        whatsapp: studentDetails.whatsapp || "",
        cpf: studentDetails.cpf || "",
        birth_date: studentDetails.birth_date || "",
        address: studentDetails.address || "",
        education: studentDetails.education || "",
        professional_area: studentDetails.professional_area || "",
        experience_level: studentDetails.experience_level || "",
        goals: studentDetails.goals || "",
        study_availability: studentDetails.study_availability || "",
      });
    }
  }, [isOpen, studentDetails, form]);

  const handleSubmit = async (values: any) => {
    try {
      // Validate CPF if provided
      if (values.cpf && !validateCPF(values.cpf)) {
        toast({
          title: "CPF inválido",
          description: "Por favor, insira um CPF válido.",
          variant: "destructive",
        });
        return;
      }

      // Validate phone if provided
      if (values.phone && !validateBrazilianPhone(values.phone)) {
        toast({
          title: "Telefone inválido",
          description: "Por favor, insira um telefone com 10 ou 11 dígitos.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.rpc('admin_update_student_data', {
        p_student_id: studentDetails?.user_id,
        p_name: values.name || null,
        p_email: values.email || null,
        p_first_name: values.first_name || null,
        p_last_name: values.last_name || null,
        p_phone: values.phone ? values.phone.replace(/\D/g, '') : null,
        p_whatsapp: values.whatsapp ? values.whatsapp.replace(/\D/g, '') : null,
        p_cpf: values.cpf ? values.cpf.replace(/\D/g, '') : null,
        p_birth_date: values.birth_date || null,
        p_address: values.address || null,
        p_education: values.education || null,
        p_professional_area: values.professional_area || null,
        p_experience_level: values.experience_level || null,
        p_goals: values.goals || null,
        p_study_availability: values.study_availability || null,
      });

      if (error) throw error;

      toast({
        title: "Dados atualizados",
        description: "Os dados do aluno foram atualizados com sucesso.",
      });

      queryClient.invalidateQueries({ queryKey: ['students'] });
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar dados",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!studentDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto"
        onInteractOutside={(e) => {
          // Prevent accidental closing
          if (e.target !== e.currentTarget) return;
          onClose();
        }}
      >
        <DialogHeader>
          <DialogTitle>Editar Dados do Aluno</DialogTitle>
          <DialogDescription>
            Edite as informações pessoais e acadêmicas do aluno selecionado.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primeiro Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <MaskedInput 
                        mask="cpf"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <MaskedInput 
                        mask="phone"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <MaskedInput 
                        mask="phone"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Educação</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ensino_fundamental">Ensino Fundamental</SelectItem>
                          <SelectItem value="ensino_medio">Ensino Médio</SelectItem>
                          <SelectItem value="ensino_superior">Ensino Superior</SelectItem>
                          <SelectItem value="pos_graduacao">Pós-graduação</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="professional_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Profissional</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Experiência</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="iniciante">Iniciante</SelectItem>
                          <SelectItem value="intermediario">Intermediário</SelectItem>
                          <SelectItem value="avancado">Avançado</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="study_availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disponibilidade de Estudo</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2h">1-2 horas por dia</SelectItem>
                          <SelectItem value="2-4h">2-4 horas por dia</SelectItem>
                          <SelectItem value="4h+">Mais de 4 horas por dia</SelectItem>
                          <SelectItem value="fins_de_semana">Apenas fins de semana</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivos</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}