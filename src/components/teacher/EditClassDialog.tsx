
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClassInfo } from "./ClassItem";
import { useIsMobile } from "@/hooks/use-mobile";

interface EditClassDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClass: ClassInfo | null;
  setSelectedClass: React.Dispatch<React.SetStateAction<ClassInfo | null>>;
  handleEditClass: () => void;
}

const EditClassDialog: React.FC<EditClassDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedClass,
  setSelectedClass,
  handleEditClass
}) => {
  const isMobile = useIsMobile();
  
  if (!selectedClass) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={isMobile ? "w-full max-w-full h-[90vh] sm:h-auto sm:max-w-lg" : ""}>
        <DialogHeader>
          <DialogTitle>Editar Turma</DialogTitle>
          <DialogDescription>
            Atualize os detalhes da turma.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh] sm:max-h-[unset]">
          <div className="space-y-4 p-1">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome da Turma *</Label>
              <Input 
                id="edit-name" 
                value={selectedClass.name}
                onChange={(e) => setSelectedClass({...selectedClass, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição *</Label>
              <Input 
                id="edit-description" 
                value={selectedClass.description}
                onChange={(e) => setSelectedClass({...selectedClass, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-startDate">Data de Início *</Label>
              <Input 
                id="edit-startDate" 
                type="date" 
                value={selectedClass.startDate}
                onChange={(e) => setSelectedClass({...selectedClass, startDate: e.target.value})}
              />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
          <Button variant="outline" onClick={() => onOpenChange(false)} className={isMobile ? "w-full" : ""}>Cancelar</Button>
          <Button onClick={handleEditClass} className={isMobile ? "w-full" : ""}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditClassDialog;
