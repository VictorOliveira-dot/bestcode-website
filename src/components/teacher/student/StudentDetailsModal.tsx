
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { StudentProgress, LessonStatus } from "../types/student";
import { formatDate } from "../utils/date-utils";

interface StudentDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentProgress | null;
  lessonStatuses: LessonStatus[];
  isMobile: boolean;
}

const StudentDetailsModal = ({ 
  isOpen, 
  onOpenChange, 
  student, 
  lessonStatuses,
  isMobile
}: StudentDetailsModalProps) => {
  if (!student) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={isMobile ? "w-full max-w-full h-[90vh] sm:h-auto sm:max-w-4xl" : "max-w-4xl"}>
        <DialogHeader>
          <DialogTitle>
            {student.name} - Progresso do Aluno
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-3">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-sm text-gray-500">Aluno</div>
                <div className="font-medium">{student.name}</div>
                <div className="text-sm mt-1">{student.email}</div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-sm text-gray-500">Turma</div>
                <div className="font-medium">{student.className}</div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-sm text-gray-500">Progresso Geral</div>
                <div className="font-medium">{student.progress}%</div>
                <Progress value={student.progress} className="h-2 mt-2" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Histórico de Aulas</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aula</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tempo Assistido</TableHead>
                      <TableHead>Último Acesso</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lessonStatuses.map((lesson) => (
                      <TableRow key={lesson.id}>
                        <TableCell className="font-medium">{lesson.title}</TableCell>
                        <TableCell>{new Date(lesson.date).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          {lesson.status === 'completed' && (
                            <span className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Concluída
                            </span>
                          )}
                          {lesson.status === 'in_progress' && (
                            <span className="flex items-center text-blue-600">
                              <Clock className="h-4 w-4 mr-1" />
                              Em andamento
                            </span>
                          )}
                          {lesson.status === 'not_started' && (
                            <span className="flex items-center text-gray-500">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Não iniciada
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {lesson.watchTimeMinutes > 0 
                            ? `${lesson.watchTimeMinutes} minutos` 
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {lesson.lastWatch ? formatDate(lesson.lastWatch) : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className={isMobile ? "w-full" : ""}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsModal;
