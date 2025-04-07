
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
    <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
      <h2 className="text-2xl font-bold">Gerenciamento de Turmas</h2>
      <Button 
        onClick={onAddClassClick} 
        className="flex items-center gap-2 w-full sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        Nova Turma
      </Button>
    </div>
  );
};

export default ClassManagementHeader;
