
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddClassDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newClass: {
    name: string;
    description: string;
    startDate: string;
  };
  setNewClass: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    startDate: string;
  }>>;
  handleAddClass: () => void;
}

const AddClassDialog: React.FC<AddClassDialogProps> = ({
  isOpen,
  onOpenChange,
  newClass,
  setNewClass,
  handleAddClass
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Turma</DialogTitle>
          <DialogDescription>
            Preencha os detalhes para criar uma nova turma.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Turma *</Label>
            <Input 
              id="name" 
              value={newClass.name}
              onChange={(e) => setNewClass({...newClass, name: e.target.value})}
              placeholder="Ex: QA-03"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Input 
              id="description" 
              value={newClass.description}
              onChange={(e) => setNewClass({...newClass, description: e.target.value})}
              placeholder="Ex: Turma de Quality Assurance - Intermediário"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Data de Início *</Label>
            <Input 
              id="startDate" 
              type="date" 
              value={newClass.startDate}
              onChange={(e) => setNewClass({...newClass, startDate: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleAddClass}>Adicionar Turma</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassDialog;
