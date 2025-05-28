
import React from "react";
import { Switch } from "@/components/ui/switch";
import { useStudentStatus } from "@/hooks/admin/useStudentStatus";

interface StudentStatusSwitchProps {
  studentId: string;
  isActive: boolean;
  studentName: string;
}

export function StudentStatusSwitch({ studentId, isActive, studentName }: StudentStatusSwitchProps) {
  const { updateStudentStatus, isPending } = useStudentStatus();

  const handleStatusChange = async (checked: boolean) => {
    await updateStudentStatus({
      studentId,
      isActive: checked
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isActive}
        onCheckedChange={handleStatusChange}
        disabled={isPending}
        aria-label={`${isActive ? 'Desativar' : 'Ativar'} aluno ${studentName}`}
      />
      <span className={`text-xs ${isActive ? 'text-green-600' : 'text-red-600'}`}>
        {isActive ? 'Ativo' : 'Inativo'}
      </span>
    </div>
  );
}
