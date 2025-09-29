
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StudentDataEditModal } from "./StudentDataEditModal";

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: {
    user_id: string;
    name: string;
    email: string;
    created_at: string;
    current_classes: Array<{
      class_id: string;
      class_name: string;
      enrollment_date: string;
      status: string;
      teacher_name?: string;
    }> | null;
    subscription_plan: string;
    progress_average: number;
    last_active: string | null;
    // Dados do perfil
    first_name?: string;
    last_name?: string;
    phone?: string;
    whatsapp?: string;
    cpf?: string;
    birth_date?: string;
    address?: string;
    education?: string;
    professional_area?: string;
    experience_level?: string;
    goals?: string;
    study_availability?: string;
    is_profile_complete?: boolean;
  } | null;
}

export function StudentDetailsModal({ isOpen, onClose, details }: StudentDetailsModalProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!details) return null;

  // Ensure current_classes is always an array even if it's null
  const currentClasses = details.current_classes || [];

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Detalhes do Aluno
              <Button onClick={handleEditClick} size="sm" className="ml-4 mr-5">
                <Edit className="h-4 w-4 mr-2" />
                Editar Dados
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações Básicas */}
              <div>
                <h3 className="font-semibold text-lg mb-3 border-b pb-1">Informações Básicas</h3>
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
                    <span className={details.is_profile_complete ? "text-green-600" : "text-red-600"}>
                      {details.is_profile_complete ? "Sim" : "Não"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Dados Pessoais */}
              <div>
                <h3 className="font-semibold text-lg mb-3 border-b pb-1">Dados Pessoais</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Nome Completo:</span> {details.first_name || 'N/A'} {details.last_name || ''}</p>
                  <p><span className="font-medium">CPF:</span> {details.cpf || 'N/A'}</p>
                  <p><span className="font-medium">Data de Nascimento:</span> {details.birth_date ? formatDate(details.birth_date) : 'N/A'}</p>
                  <p><span className="font-medium">Telefone:</span> {details.phone || 'N/A'}</p>
                  <p><span className="font-medium">WhatsApp:</span> {details.whatsapp || 'N/A'}</p>
                  <p><span className="font-medium">Endereço:</span> {details.address || 'N/A'}</p>
                </div>
              </div>

              {/* Informações Acadêmicas/Profissionais */}
              <div>
                <h3 className="font-semibold text-lg mb-3 border-b pb-1">Perfil Acadêmico/Profissional</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Educação:</span> {details.education || 'N/A'}</p>
                  <p><span className="font-medium">Área Profissional:</span> {details.professional_area || 'N/A'}</p>
                  <p><span className="font-medium">Nível de Experiência:</span> {details.experience_level || 'N/A'}</p>
                  <p><span className="font-medium">Disponibilidade de Estudo:</span> {details.study_availability || 'N/A'}</p>
                </div>
                {details.goals && (
                  <div className="mt-3">
                    <p className="font-medium">Objetivos:</p>
                    <p className="text-sm text-gray-600 mt-1">{details.goals}</p>
                  </div>
                )}
              </div>

              {/* Turmas */}
              <div>
                <h3 className="font-semibold text-lg mb-3 border-b pb-1">Turmas Matriculadas</h3>
                <div className="space-y-3">
                  {currentClasses.length > 0 ? (
                    currentClasses.map((cls) => (
                      <div key={cls.class_id} className="border p-3 rounded-md bg-gray-50">
                        <p className="font-medium">{cls.class_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Professor: {cls.teacher_name || 'N/A'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Matrícula: {formatDate(cls.enrollment_date)}
                        </p>
                        <p className="text-sm">
                          Status: <span className={`capitalize ${cls.status === 'active' ? 'text-green-600' : cls.status === 'completed' ? 'text-blue-600' : 'text-red-600'}`}>
                            {cls.status === 'active' ? 'Ativo' : cls.status === 'completed' ? 'Concluído' : 'Cancelado'}
                          </span>
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

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <StudentDataEditModal
        isOpen={showEditModal}
        onClose={handleEditClose}
        studentDetails={details}
      />
    </>
  );
}
