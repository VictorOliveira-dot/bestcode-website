import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserMinus, Users } from "lucide-react";

interface StudentEnrollment {
  enrollment_id: string;
  class_id: string;
  class_name: string;
}

interface UnenrollStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: string;
    name: string;
    email: string;
  } | null;
  enrollments: StudentEnrollment[];
  onUnenroll: (studentId: string, classId: string, className: string) => Promise<void>;
  isLoading?: boolean;
}

export const UnenrollStudentModal: React.FC<UnenrollStudentModalProps> = ({
  isOpen,
  onClose,
  student,
  enrollments,
  onUnenroll,
  isLoading = false
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const handleUnenroll = async () => {
    if (!student || enrollments.length === 0) return;

    // Para uma única turma, usa diretamente a primeira turma
    // Para múltiplas turmas, usa a selecionada
    const targetClassId = enrollments.length === 1 ? enrollments[0].class_id : selectedClassId;
    
    if (!targetClassId) return;

    const selectedEnrollment = enrollments.find(e => e.class_id === targetClassId);
    if (!selectedEnrollment) return;

    try {
      await onUnenroll(student.id, targetClassId, selectedEnrollment.class_name);
      onClose();
      setSelectedClassId("");
    } catch (error) {
      console.error('Erro ao desvincular aluno:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedClassId("");
  };

  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" onInteractOutside={handleClose}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserMinus className="h-5 w-5 text-red-600" />
            Desvincular Aluno
          </DialogTitle>
          <DialogDescription>
            Selecione a turma da qual deseja desvincular o aluno <strong>{student.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Aluno:</label>
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-medium">{student.name}</div>
              <div className="text-sm text-muted-foreground">{student.email}</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Turmas Vinculadas ({enrollments.length}):
            </label>
            
            {enrollments.length === 0 ? (
              <div className="p-3 text-center text-muted-foreground">
                Este aluno não está vinculado a nenhuma turma sua.
              </div>
            ) : enrollments.length === 1 ? (
              <div className="space-y-2">
                <Badge variant="secondary" className="p-2">
                  {enrollments[0].class_name}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Este aluno será desvinculado da única turma disponível.
                </p>
              </div>
            ) : (
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {enrollments.map((enrollment) => (
                    <SelectItem key={enrollment.class_id} value={enrollment.class_id}>
                      {enrollment.class_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleUnenroll}
            disabled={
              isLoading || 
              enrollments.length === 0 || 
              (enrollments.length > 1 && !selectedClassId)
            }
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Desvinculando...
              </>
            ) : (
              <>
                <UserMinus className="h-4 w-4" />
                Desvincular
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};