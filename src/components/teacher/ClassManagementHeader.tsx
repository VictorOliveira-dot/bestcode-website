
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
    <div className="flex justify-between items-center mb-6 sm:flex-row sm: gap-4 flex-col">
      <h2 className="text-3xl font-bold">Gerenciamento de Turmas</h2>
      <Button 
        onClick={onAddClassClick} 
        className="flex items-center gap-2 "
        disabled={isLoading}
      >
        <Plus className="h-4 w-4" />
        {isLoading ? "Carregando..." : "Nova Turma"}
      </Button>
    </div>
  );
};

export default ClassManagementHeader;
