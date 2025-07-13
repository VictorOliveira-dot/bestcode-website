import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAvailableClasses } from "@/hooks/admin/useAvailableClasses";

interface CreateEnrollmentModalProps {
  onEnrollmentCreated?: () => void;
}

const CreateEnrollmentModal: React.FC<CreateEnrollmentModalProps> = ({
  onEnrollmentCreated
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    classId: "no-class"
  });

  const { availableClasses, isLoading: isLoadingClasses } = useAvailableClasses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Criar usuário
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: 'student'
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Erro ao criar usuário");
      }

      // 2. Criar registro na tabela users
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: formData.email,
          name: formData.name,
          role: 'student',
          is_active: true
        });

      if (userError) {
        console.error("Erro ao criar usuário na tabela:", userError);
      }

      // 3. Criar matrícula se classe selecionada (e não for "no-class")
      if (formData.classId && formData.classId !== "no-class") {
        const { error: enrollmentError } = await supabase
          .from('enrollments')
          .insert({
            student_id: authData.user.id,
            user_id: authData.user.id,
            class_id: formData.classId,
            status: 'active'
          });

        if (enrollmentError) {
          console.error("Erro ao criar matrícula:", enrollmentError);
          toast({
            title: "Usuário criado",
            description: "Usuário criado mas erro ao matricular na turma. Faça a matrícula manualmente.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sucesso",
            description: "Usuário criado e matriculado com sucesso!"
          });
        }
      } else {
        toast({
          title: "Usuário criado",
          description: "Usuário criado com sucesso. Matrícula pode ser feita posteriormente."
        });
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        classId: "no-class"
      });
      setOpen(false);
      onEnrollmentCreated?.();

    } catch (error: any) {
      console.error("Erro ao criar matrícula:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar matrícula",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus2 className="h-4 w-4 mr-2" />
          Criar Matrícula
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Matrícula</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Senha Temporária</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              minLength={6}
            />
          </div>

          <div>
            <Label htmlFor="class">Turma (Opcional)</Label>
            <Select value={formData.classId} onValueChange={(value) => setFormData(prev => ({ ...prev, classId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma turma" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingClasses ? (
                  <SelectItem value="loading" disabled>Carregando...</SelectItem>
                ) : (
                  <>
                    <SelectItem value="no-class">Sem turma inicial</SelectItem>
                    {availableClasses?.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} - {cls.teacher_name}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Matrícula"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEnrollmentModal;