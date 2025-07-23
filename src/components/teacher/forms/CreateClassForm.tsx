
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

interface CreateClassFormProps {
  onClassCreated: (classId: string) => void;
  onCancel: () => void;
}

const CreateClassForm: React.FC<CreateClassFormProps> = ({
  onClassCreated,
  onCancel,
}) => {
  const { user } = useAuth();
  const [newClass, setNewClass] = useState({
    name: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateClass = async () => {
    if (!newClass.name.trim() || !newClass.description.trim()) {
      toast({
        title: "Erro",
        description: "Nome e descrição da turma são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      // console.log("Creating new class:", newClass);
      
      const { data, error } = await supabase.rpc('create_teacher_class', {
        p_name: newClass.name,
        p_description: newClass.description,
        p_start_date: newClass.startDate
      });

      if (error) {
        console.error('Error creating class:', error);
        throw error;
      }

      // console.log("Class created successfully with ID:", data);
      
      toast({
        title: "Turma criada",
        description: "A turma foi criada com sucesso",
      });

      onClassCreated(data);
      
      // Reset form
      setNewClass({
        name: "",
        description: "",
        startDate: new Date().toISOString().split("T")[0],
      });
    } catch (error: any) {
      console.error('Error creating class:', error);
      toast({
        title: "Erro ao criar turma",
        description: error.message || "Ocorreu um erro ao criar a turma",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-gray-50 max-h-[60vh] overflow-y-auto">
      <div>
        <Label htmlFor="className">Nome da Turma</Label>
        <Input
          id="className"
          value={newClass.name}
          onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
          placeholder="Nome da nova turma"
        />
      </div>
      <div>
        <Label htmlFor="classDescription">Descrição da Turma</Label>
        <Textarea
          id="classDescription"
          value={newClass.description}
          onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
          placeholder="Descrição da nova turma"
          className="min-h-[100px]"
        />
      </div>
      <div>
        <Label htmlFor="classStartDate">Data de Início</Label>
        <Input
          id="classStartDate"
          type="date"
          value={newClass.startDate}
          onChange={(e) => setNewClass({ ...newClass, startDate: e.target.value })}
        />
      </div>
      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          onClick={handleCreateClass}
          disabled={isCreating}
          className="flex-1"
        >
          {isCreating ? "Criando..." : "Criar Turma"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default CreateClassForm;
