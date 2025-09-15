import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus } from "lucide-react";

interface AddAdminDialogProps {
  onAdminAdded: () => void;
}

const AddAdminDialog: React.FC<AddAdminDialogProps> = ({ onAdminAdded }) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "Email é obrigatório",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "Email inválido",
      });
      return false;
    }

    if (!password.trim()) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "Senha é obrigatória",
      });
      return false;
    }

    if (password.length < 8) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "A senha deve ter pelo menos 8 caracteres",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Usuário não autenticado");
      }

      const { data, error } = await supabase.functions.invoke("admin-create-admin", {
        body: {
          email: email.trim(),
          password: password.trim(),
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw new Error("Erro ao conectar com o servidor");
      }

      if (!data?.success) {
        throw new Error(data?.error || "Erro desconhecido");
      }

      toast({
        title: "Sucesso!",
        description: data.message || "Administrador criado com sucesso",
      });

      // Limpar formulário
      setEmail("");
      setPassword("");
      setOpen(false);
      
      // Notificar componente pai
      onAdminAdded();

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar administrador",
        description: error.message || "Tente novamente mais tarde",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        resetForm();
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Criar Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Administrador</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo administrador. O acesso será concedido após a criação.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <PasswordInput
                id="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <p className="text-sm text-muted-foreground">
                A senha deve ter pelo menos 8 caracteres
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Administrador"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdminDialog;