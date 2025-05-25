
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import CreateClassForm from "./CreateClassForm";
import { Class } from "@/hooks/teacher/useDashboardData";

interface ClassSelectorProps {
  classes: Class[];
  selectedClassId: string;
  onClassChange: (classId: string) => void;
  onClassesUpdate: () => void;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({
  classes,
  selectedClassId,
  onClassChange,
  onClassesUpdate,
}) => {
  const [showCreateClass, setShowCreateClass] = useState(false);

  const handleClassCreated = (classId: string) => {
    onClassChange(classId);
    setShowCreateClass(false);
    onClassesUpdate();
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="class">Turma</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowCreateClass(!showCreateClass)}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          {showCreateClass ? "Cancelar" : "Criar Turma"}
        </Button>
      </div>
      
      {showCreateClass ? (
        <CreateClassForm
          onClassCreated={handleClassCreated}
          onCancel={() => setShowCreateClass(false)}
        />
      ) : (
        <Select
          value={selectedClassId}
          onValueChange={onClassChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma turma" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default ClassSelector;
