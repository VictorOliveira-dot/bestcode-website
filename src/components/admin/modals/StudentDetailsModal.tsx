
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { useStudentDetails, StudentFullDetails } from "@/hooks/admin/useStudentDetails";

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string | null;
}

export function StudentDetailsModal({ isOpen, onClose, studentId }: StudentDetailsModalProps) {
  const { data: details, isLoading, error } = useStudentDetails(studentId);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Aluno</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : error ? (
          <div className="text-red-500">
            Erro ao carregar detalhes: {error.message}
          </div>
        ) : details ? (
          <div className="grid gap-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Informações Básicas</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Nome:</span> {details.name}</p>
                  <p><span className="font-medium">Email:</span> {details.email}</p>
                  <p><span className="font-medium">Data de Cadastro:</span> {formatDate(details.created_at)}</p>
                  <p><span className="font-medium">Plano:</span> {details.subscription_plan}</p>
                  <p><span className="font-medium">Progresso Médio:</span> {Math.round(details.progress_average)}%</p>
                  <p>
                    <span className="font-medium">Última Atividade:</span>{" "}
                    {details.last_active ? formatDate(details.last_active) : "Nunca"}
                  </p>
                  <p>
                    <span className="font-medium">Perfil Completo:</span>{" "}
                    <Badge variant={details.is_profile_complete ? "default" : "secondary"}>
                      {details.is_profile_complete ? "Sim" : "Não"}
                    </Badge>
                  </p>
                </div>
              </div>

              {/* Dados do Perfil */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Dados do Perfil</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Nome Completo:</span> {details.first_name || 'N/A'} {details.last_name || ''}</p>
                  <p><span className="font-medium">Telefone:</span> {details.phone || 'N/A'}</p>
                  <p><span className="font-medium">WhatsApp:</span> {details.whatsapp || 'N/A'}</p>
                  <p><span className="font-medium">CPF:</span> {details.cpf || 'N/A'}</p>
                  <p><span className="font-medium">Data de Nascimento:</span> {details.birth_date ? formatDate(details.birth_date) : 'N/A'}</p>
                  <p><span className="font-medium">Endereço:</span> {details.address || 'N/A'}</p>
                  <p><span className="font-medium">Educação:</span> {details.education || 'N/A'}</p>
                  <p><span className="font-medium">Área Profissional:</span> {details.professional_area || 'N/A'}</p>
                  <p><span className="font-medium">Nível de Experiência:</span> {details.experience_level || 'N/A'}</p>
                  <p><span className="font-medium">Objetivos:</span> {details.goals || 'N/A'}</p>
                  <p><span className="font-medium">Disponibilidade:</span> {details.study_availability || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Turmas */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Turmas Matriculadas</h3>
              <div className="space-y-4">
                {details.current_classes && details.current_classes.length > 0 ? (
                  details.current_classes.map((cls) => (
                    <div key={cls.class_id} className="border p-4 rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{cls.class_name}</h4>
                        <Badge variant={cls.status === 'active' ? 'default' : 'secondary'}>
                          {cls.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Professor: {cls.teacher_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Matrícula: {formatDate(cls.enrollment_date)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Nenhuma turma encontrada</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">Nenhum dado encontrado</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
