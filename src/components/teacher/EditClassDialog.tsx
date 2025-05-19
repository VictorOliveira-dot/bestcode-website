
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
import { ClassInfo } from "./ClassItem";
import { Loader } from "lucide-react";

interface EditClassDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClass: ClassInfo | null;
  setSelectedClass: React.Dispatch<React.SetStateAction<ClassInfo | null>>;
  handleEditClass: () => void;
  isLoading?: boolean;
}

const EditClassDialog: React.FC<EditClassDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedClass,
  setSelectedClass,
  handleEditClass,
  isLoading = false
}) => {
  const isFormValid = selectedClass?.name?.trim() !== '' && 
                     selectedClass?.description?.trim() !== '' && 
                     selectedClass?.startDate !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isLoading) {
      handleEditClass();
    }
  };
                     
  if (!selectedClass) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isLoading) {
        onOpenChange(open);
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Turma</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Nome da Turma</Label>
            <Input
              id="edit-name"
              value={selectedClass.name}
              onChange={(e) => setSelectedClass({...selectedClass, name: e.target.value})}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Descrição</Label>
            <Textarea
              id="edit-description"
              value={selectedClass.description}
              onChange={(e) => setSelectedClass({...selectedClass, description: e.target.value})}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-date">Data de Início</Label>
            <Input
              id="edit-date"
              type="date"
              value={selectedClass.startDate}
              onChange={(e) => setSelectedClass({...selectedClass, startDate: e.target.value})}
              disabled={isLoading}
              required
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !isFormValid}
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
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClassDialog;
