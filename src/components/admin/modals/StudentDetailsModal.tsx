
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

const formatCPF = (cpf: string | null) => {
  if (!cpf) return 'N/A';
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  // Formata como XXX.XXX.XXX-XX
  if (cleanCPF.length === 11) {
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return cpf;
};

const formatPhone = (phone: string | null) => {
  if (!phone) return 'N/A';
  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  // Formata como (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

export function StudentDetailsModal({ isOpen, onClose, studentId }: StudentDetailsModalProps) {
  const { data: details, isLoading, error } = useStudentDetails(studentId);

  console.log('[StudentDetailsModal] Modal state:', { isOpen, studentId, isLoading, error, details });

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
            <h3 className="font-medium mb-2">Erro ao carregar detalhes</h3>
            <p className="text-sm">{error.message}</p>
          </div>
        ) : details ? (
          <div className="grid gap-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Informações Básicas</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-sm text-gray-600">Nome Completo:</span>
                    <p className="text-sm">{details.first_name && details.last_name 
                      ? `${details.first_name} ${details.last_name}` 
                      : details.name || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-gray-600">Email:</span>
                    <p className="text-sm">{details.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-gray-600">Data de Cadastro:</span>
                    <p className="text-sm">{formatDate(details.created_at)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-gray-600">Plano:</span>
                    <p className="text-sm">{details.subscription_plan}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-gray-600">Progresso Médio:</span>
                    <p className="text-sm">{Math.round(details.progress_average)}%</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-gray-600">Última Atividade:</span>
                    <p className="text-sm">
                      {details.last_active ? formatDate(details.last_active) : "Nunca"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-gray-600">Perfil Completo:</span>
                    <Badge variant={details.is_profile_complete ? "default" : "secondary"} className="ml-2">
                      {details.is_profile_complete ? "Sim" : "Não"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Dados Pessoais</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-sm text-gray-600">CPF:</span>
                    <p className="text-sm">{formatCPF(details.cpf)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-gray-600">Data de Nascimento:</span>
                    <p className="text-sm">{details.birth_date ? formatDate(details.birth_date) : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-gray-600">Gênero:</span>
                    <p className="text-sm">{details.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-gray-600">Telefone:</span>
                    <p className="text-sm">{formatPhone(details.phone)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-gray-600">WhatsApp:</span>
                    <p className="text-sm">{formatPhone(details.whatsapp)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-gray-600">Endereço:</span>
                    <p className="text-sm">{details.address || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-gray-600">Como conheceu:</span>
                    <p className="text-sm">{details.referral || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Profissionais */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Perfil Profissional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-sm text-gray-600">Educação:</span>
                  <p className="text-sm">{details.education || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-sm text-gray-600">Área Profissional:</span>
                  <p className="text-sm">{details.professional_area || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-sm text-gray-600">Nível de Experiência:</span>
                  <p className="text-sm">{details.experience_level || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-sm text-gray-600">Disponibilidade:</span>
                  <p className="text-sm">{details.study_availability || 'N/A'}</p>
                </div>
              </div>
              <div>
                <span className="font-medium text-sm text-gray-600">Objetivos:</span>
                <p className="text-sm">{details.goals || 'N/A'}</p>
              </div>
            </div>

            {/* Turmas */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Turmas Matriculadas</h3>
              <div className="space-y-4">
                {details.current_classes && details.current_classes.length > 0 ? (
                  details.current_classes.map((cls) => (
                    <div key={cls.class_id} className="border p-4 rounded-md bg-gray-50">
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
