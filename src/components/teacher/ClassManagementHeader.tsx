
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ClassManagementHeaderProps {
  onAddClassClick: () => void;
  isLoading: boolean;
}

const ClassManagementHeader: React.FC<ClassManagementHeaderProps> = ({ 
  onAddClassClick, 
  isLoading 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold">Gerenciamento de Turmas</h2>
      <Button 
        onClick={onAddClassClick} 
        className="flex items-center gap-2"
        variant="default"
      >
        <Plus className="h-4 w-4" />
        Nova Turma
      </Button>
    </div>
  );
};

export default ClassManagementHeader;
