
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: {
    name: string;
    email: string;
    created_at: string;
    current_classes: Array<{
      class_id: string;
      class_name: string;
      enrollment_date: string;
      status: string;
    }> | null;
    subscription_plan: string;
    progress_average: number;
    last_active: string | null;
  } | null;
}

export function StudentDetailsModal({ isOpen, onClose, details }: StudentDetailsModalProps) {
  if (!details) return null;

  // Ensure current_classes is always an array even if it's null
  const currentClasses = details.current_classes || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Aluno</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Informações Básicas</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Nome:</span> {details.name}</p>
                <p><span className="font-medium">Email:</span> {details.email}</p>
                <p><span className="font-medium">Data de Cadastro:</span> {formatDate(details.created_at)}</p>
                <p><span className="font-medium">Plano:</span> {details.subscription_plan}</p>
                <p><span className="font-medium">Progresso Médio:</span> {Math.round(details.progress_average)}%</p>
                <p>
                  <span className="font-medium">Última Atividade:</span>{" "}
                  {details.last_active ? formatDate(details.last_active) : "Nunca"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Turmas</h3>
              <div className="mt-2 space-y-4">
                {currentClasses.length > 0 ? (
                  currentClasses.map((cls) => (
                    <div key={cls.class_id} className="border p-3 rounded-md">
                      <p className="font-medium">{cls.class_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Matrícula: {formatDate(cls.enrollment_date)}
                      </p>
                      <p className="text-sm">
                        Status: <span className="capitalize">{cls.status}</span>
                      </p>
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
