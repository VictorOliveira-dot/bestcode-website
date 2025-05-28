
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Calendar, 
  BookOpen, 
  Bell, 
  BarChart3,
  ChevronRight,
  CheckCircle,
  Clock,
  Users
} from "lucide-react";

interface StudentDocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

const StudentDocumentation: React.FC<StudentDocumentationProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-bestcode-800">
            Documentação do Painel do Aluno
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Dashboard Principal */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-bestcode-600" />
              Dashboard Principal
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Visão Geral:</strong> O dashboard mostra estatísticas do seu progresso, incluindo aulas em andamento, concluídas e progresso geral.</p>
              <p><strong>Cards de Estatísticas:</strong> Visualize rapidamente quantas aulas você tem disponíveis, em progresso e concluídas.</p>
              <p><strong>Navegação:</strong> Use o menu superior para acessar diferentes seções do sistema.</p>
            </div>
          </section>

          {/* Minhas Aulas */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Play className="h-5 w-5 text-bestcode-600" />
              Minhas Aulas
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <h4 className="font-medium mb-2">Abas Disponíveis:</h4>
                <ul className="space-y-1 ml-4">
                  <li><strong>Não Iniciadas:</strong> Aulas que você ainda não começou (ordenadas por prioridade)</li>
                  <li><strong>Continuar Assistindo:</strong> Aulas que você já iniciou mas não concluiu</li>
                  <li><strong>Concluídas:</strong> Aulas que você finalizou com 100% de progresso</li>
                  <li><strong>Cursos Complementares:</strong> Conteúdo adicional criado pelos professores</li>
                  <li><strong>Todas:</strong> Visualização completa de todas as aulas disponíveis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Funcionalidades:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Clique em qualquer aula para abrir o player de vídeo</li>
                  <li>• Veja o progresso de cada aula na barra de progresso</li>
                  <li>• Status colorido indica o estado da aula (não iniciada, em andamento, concluída)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Player de Vídeo */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Play className="h-5 w-5 text-bestcode-600" />
              Player de Vídeo
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <h4 className="font-medium mb-2">Controles Disponíveis:</h4>
                <ul className="space-y-1 ml-4">
                  <li><strong>Salvar Progresso:</strong> Salva manualmente seu progresso atual</li>
                  <li><strong>Concluir Aula:</strong> Marca a aula como 100% concluída</li>
                  <li><strong>Aula Anterior:</strong> Navega para a aula anterior (se disponível)</li>
                  <li><strong>Próxima Aula:</strong> Avança para a próxima aula (se disponível)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Salvamento Automático:</h4>
                <p>• O progresso é salvo automaticamente a cada minuto assistido</p>
                <p>• Ao fechar o modal, o progresso é salvo automaticamente</p>
                <p>• Link direto para o YouTube está disponível caso haja problemas de reprodução</p>
              </div>
            </div>
          </section>

          {/* Agenda */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-bestcode-600" />
              Minha Agenda
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Próximas Atividades:</strong> Visualize suas aulas programadas organizadas por data.</p>
              <p><strong>Ver Aula:</strong> Clique no botão "Ver Aula" para ir diretamente para a aula específica.</p>
              <p><strong>Informações:</strong> Veja detalhes como data, horário, duração e turma de cada atividade.</p>
            </div>
          </section>

          {/* Meus Cursos */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-bestcode-600" />
              Meus Cursos
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Visão dos Cursos:</strong> Veja todos os cursos em que você está matriculado.</p>
              <p><strong>Informações do Curso:</strong> Professor responsável, data de início, status e progresso geral.</p>
              <p><strong>Acessar Aulas:</strong> Use o botão "Acessar Aulas" para ir direto ao conteúdo do curso.</p>
            </div>
          </section>

          {/* Notificações */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Bell className="h-5 w-5 text-bestcode-600" />
              Notificações
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Novas Aulas:</strong> Receba notificações quando professores adicionarem novas aulas.</p>
              <p><strong>Lembretes:</strong> Avisos importantes sobre prazos e atividades.</p>
              <p><strong>Marcar como Lida:</strong> Clique em notificações não lidas para marcá-las como lidas.</p>
              <p><strong>Contador:</strong> O número de notificações não lidas aparece no cabeçalho.</p>
            </div>
          </section>

          {/* Dicas Gerais */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-bestcode-600" />
              Dicas Gerais
            </h3>
            <div className="bg-bestcode-50 p-4 rounded-lg space-y-2">
              <p>• <strong>Organize seus estudos:</strong> Comece pelas aulas "Não Iniciadas" para manter o cronograma.</p>
              <p>• <strong>Acompanhe seu progresso:</strong> Use as barras de progresso para monitorar seu avanço.</p>
              <p>• <strong>Navegação rápida:</strong> Use os botões de navegação no player para pular entre aulas.</p>
              <p>• <strong>Fique atento às notificações:</strong> Elas te mantêm informado sobre novidades do curso.</p>
              <p>• <strong>Cursos complementares:</strong> Não esqueça de verificar conteúdo adicional na aba específica.</p>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose} className="bg-bestcode-600 hover:bg-bestcode-700">
              Entendi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDocumentation;
