
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

interface TeacherDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: {
    name: string;
    email: string;
    created_at: string;
    classes: Array<{
      id: string;
      name: string;
    }> | null;
    classes_count: number;
    students_count: number;
  } | null;
}

export function TeacherDetailsModal({ isOpen, onClose, details }: TeacherDetailsModalProps) {
  if (!details) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Professor</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Informações Básicas</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Nome:</span> {details.name}</p>
                <p><span className="font-medium">Email:</span> {details.email}</p>
                <p><span className="font-medium">Data de Cadastro:</span> {formatDate(details.created_at)}</p>
                <p><span className="font-medium">Total de Alunos:</span> {details.students_count}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Turmas ({details.classes_count})</h3>
              <div className="mt-2 space-y-4">
                {details.classes && details.classes.length > 0 ? (
                  details.classes.map((cls) => (
                    <div key={cls.id} className="border p-3 rounded-md">
                      <p className="font-medium">{cls.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Nenhuma turma encontrada</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
