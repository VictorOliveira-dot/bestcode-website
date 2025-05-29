
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStudentDataUpdate } from "@/hooks/admin/useStudentDataUpdate";

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
  const { updateStudentData, isUpdating } = useStudentDataUpdate();
  
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
    if (!studentDetails) return;

    await updateStudentData({
      student_id: studentDetails.user_id,
      ...values
    });
    onClose();
  };

  if (!studentDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Dados do Aluno</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dados Básicos */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Dados Básicos</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nome completo" />
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
                        <Input {...field} type="email" placeholder="email@exemplo.com" />
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
                        <Input {...field} placeholder="Primeiro nome" />
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
                        <Input {...field} placeholder="Sobrenome" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contato */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Dados de Contato</h3>
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="(11) 99999-9999" />
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
                        <Input {...field} placeholder="(11) 99999-9999" />
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
                        <Input {...field} placeholder="000.000.000-00" />
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
              </div>

              {/* Endereço */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Endereço</h3>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço Completo</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Rua, número, bairro, cidade, estado, CEP" rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Informações Acadêmicas/Profissionais */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Perfil Acadêmico/Profissional</h3>
                
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Educação</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a escolaridade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ensino_medio">Ensino Médio</SelectItem>
                            <SelectItem value="tecnico">Técnico</SelectItem>
                            <SelectItem value="superior_incompleto">Superior Incompleto</SelectItem>
                            <SelectItem value="superior_completo">Superior Completo</SelectItem>
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
                        <Input {...field} placeholder="Ex: Tecnologia, Marketing, Vendas" />
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o nível" />
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a disponibilidade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-3h">1-3 horas por dia</SelectItem>
                            <SelectItem value="3-5h">3-5 horas por dia</SelectItem>
                            <SelectItem value="5h+">Mais de 5 horas por dia</SelectItem>
                            <SelectItem value="fins_semana">Apenas fins de semana</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Objetivos */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Objetivos</h3>
              
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivos com o Curso</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Descreva os objetivos do aluno com o curso..." rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
