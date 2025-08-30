import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useStudentManagement } from "@/hooks/teacher/useStudentManagementFixed";
import { EnrollStudentToClassModal } from "./modals/EnrollStudentToClassModal";
import { Search, Users, UserPlus, UserMinus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AllStudentsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedStudentToUnenroll, setSelectedStudentToUnenroll] = useState<{
    studentId: string;
    studentName: string;
    classId: string;
    className: string;
  } | null>(null);

  const { 
    allStudents, 
    isLoadingStudents, 
    unenrollStudent
  } = useStudentManagement();

  const filteredStudents = allStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class_names.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUnenrollConfirm = async () => {
    if (!selectedStudentToUnenroll) return;

    try {
      await unenrollStudent({
        studentId: selectedStudentToUnenroll.studentId,
        classId: selectedStudentToUnenroll.classId
      });

      setSelectedStudentToUnenroll(null);
      
      toast({
        title: "Aluno desvinculado",
        description: `${selectedStudentToUnenroll.studentName} foi desvinculado com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao desvincular aluno:', error);
      toast({
        title: "Erro ao desvincular",
        description: "Não foi possível desvincular o aluno. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingStudents) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Todos os Alunos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Todos os Alunos ({filteredStudents.length})
            </CardTitle>
            <Button 
              onClick={() => setShowEnrollModal(true)}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <UserPlus className="h-4 w-4" />
              <span>Vincular Aluno</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 overflow-x-auto">
          {/* Barra de pesquisa */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou turma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Tabela de alunos */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Nome</TableHead>
                  <TableHead className="min-w-[200px]">Email</TableHead>
                  <TableHead className="min-w-[120px]">Turmas</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="text-right min-w-[120px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Nenhum aluno encontrado" : "Nenhum aluno cadastrado"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <Badge variant={student.class_names === 'Sem vínculo' ? 'secondary' : 'default'}>
                          {student.class_names}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={student.is_active ? 'default' : 'destructive'}>
                          {student.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {student.class_names !== 'Sem vínculo' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // For multiple classes, show warning
                              if (student.class_names.includes(',')) {
                                toast({
                                  title: "Múltiplas turmas",
                                  description: "Este aluno está em múltiplas turmas. Entre em contato com o administrador para desvincular turmas específicas.",
                                  variant: "default",
                                });
                                return;
                              }
                              
                              // Get the proper class ID from the first class (simplified)
                              const firstClassName = student.class_names.split(',')[0].trim();
                              setSelectedStudentToUnenroll({
                                studentId: student.id,
                                studentName: student.name,
                                classId: firstClassName, // This will be resolved by backend
                                className: firstClassName
                              });
                            }}
                            className="flex items-center gap-1"
                          >
                            <UserMinus className="h-3 w-3" />
                            Desvincular
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <EnrollStudentToClassModal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        availableStudents={allStudents.map(s => ({
          id: s.id,
          name: s.name,
          email: s.email
        }))}
      />

      <AlertDialog 
        open={!!selectedStudentToUnenroll} 
        onOpenChange={() => setSelectedStudentToUnenroll(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desvincular aluno</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desvincular <strong>{selectedStudentToUnenroll?.studentName}</strong> da turma <strong>{selectedStudentToUnenroll?.className}</strong>?
              <br /><br />
              Esta ação pode ser desfeita posteriormente vinculando o aluno novamente à turma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleUnenrollConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Desvincular
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AllStudentsTab;