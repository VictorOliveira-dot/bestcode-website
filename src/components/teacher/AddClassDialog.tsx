
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";

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
  isLoading?: boolean;
}

const AddClassDialog: React.FC<AddClassDialogProps> = ({
  isOpen,
  onOpenChange,
  newClass,
  setNewClass,
  handleAddClass,
  isLoading = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isLoading) { // Prevent closing the dialog while loading
        onOpenChange(open);
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Turma</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome da Turma</Label>
            <Input
              id="name"
              placeholder="Ex: Turma de JavaScript"
              value={newClass.name}
              onChange={(e) => setNewClass({...newClass, name: e.target.value})}
              disabled={isLoading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva a turma"
              value={newClass.description}
              onChange={(e) => setNewClass({...newClass, description: e.target.value})}
              disabled={isLoading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date">Data de Início</Label>
            <Input
              id="date"
              type="date"
              value={newClass.startDate}
              onChange={(e) => setNewClass({...newClass, startDate: e.target.value})}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAddClass}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassDialog;
