
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { useAllClasses } from "@/hooks/admin/useAllClasses";
import { useTeacherData } from "@/hooks/teacher/useTeacherData";
import { useStudentEnrollment } from "@/hooks/admin/useStudentEnrollment";

interface EnrollStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableStudents: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

export function EnrollStudentModal({ 
  isOpen, 
  onClose, 
  availableStudents 
}: EnrollStudentModalProps) {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  
  const { allClasses } = useAllClasses();
  const { enrollStudent, isPending } = useStudentEnrollment();

  const handleEnroll = async () => {
    if (!selectedStudent || !selectedClass) {
      return;
    }

    await enrollStudent({
      studentId: selectedStudent,
      classId: selectedClass
    });

    setSelectedStudent("");
    setSelectedClass("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vincular Estudante à Turma</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Estudante</label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um estudante" />
              </SelectTrigger>
              <SelectContent>
                {availableStudents.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} ({student.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Turma</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma turma" />
              </SelectTrigger>
              <SelectContent>
                {allClasses.map((cls) => (
                  <SelectItem key={cls.class_id} value={cls.class_id}>
                    {cls.class_name} - {cls.teacher_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button 
            onClick={handleEnroll} 
            disabled={!selectedStudent || !selectedClass || isPending}
          >
            {isPending ? "Vinculando..." : "Vincular"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
