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
      // Criar aluno e matrícula via Edge Function (sem trocar sessão)
      const { data: { session } } = await supabase.auth.getSession();
      const authHeaders = session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : undefined;

      const { data: result, error: fnError } = await supabase.functions.invoke(
        'admin-create-student',
        {
          body: {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            classId: formData.classId !== 'no-class' ? formData.classId : undefined,
          },
          headers: authHeaders,
        }
      );

      if (fnError || !result?.success) {
        let errMsg = result?.error || fnError?.message;
        try {
          const ctx: any = (fnError as any)?.context;
          const bodyStr = ctx?.body ?? ctx?.response ?? ctx;
          if (bodyStr) {
            const parsed = typeof bodyStr === 'string' ? JSON.parse(bodyStr) : bodyStr;
            errMsg = parsed?.error || parsed?.message || errMsg;
          }
        } catch { /* ignore parse errors */ }
        throw new Error(errMsg || 'Falha ao criar aluno');
      }

      if (result.enrolled) {
        toast({ title: 'Sucesso', description: 'Usuário criado e matriculado com sucesso!' });
      } else {
        toast({ title: 'Usuário criado', description: 'Usuário criado com sucesso. Matrícula pode ser feita posteriormente.' });
      }

      setFormData({ name: '', email: '', password: '', classId: 'no-class' });
      setOpen(false);

      // Atualiza listas sem sair da página
      onEnrollmentCreated?.();
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Erro ao criar matrícula", variant: "destructive" });
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