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
import { useStudentEnrollments } from "@/hooks/teacher/useStudentEnrollments";
import { EnrollStudentToClassModal } from "./modals/EnrollStudentToClassModal";
import { UnenrollStudentModal } from "./modals/UnenrollStudentModal";
import { Search, Users, UserPlus, UserMinus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AllStudentsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedStudentForUnenroll, setSelectedStudentForUnenroll] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  const { 
    allStudents, 
    isLoadingStudents, 
    unenrollStudent
  } = useStudentManagement();

  const { 
    enrollments, 
    isLoading: isLoadingEnrollments 
  } = useStudentEnrollments(selectedStudentForUnenroll?.id || "");

  const filteredStudents = allStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class_names.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUnenrollStudent = async (studentId: string, classId: string, className: string) => {
    try {
      await unenrollStudent({ studentId, classId });
      
      toast({
        title: "Aluno desvinculado",
        description: `Aluno foi desvinculado da turma ${className} com sucesso.`,
      });
    } catch (error) {
      
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
                              setSelectedStudentForUnenroll({
                                id: student.id,
                                name: student.name,
                                email: student.email
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

      <UnenrollStudentModal
        isOpen={!!selectedStudentForUnenroll}
        onClose={() => setSelectedStudentForUnenroll(null)}
        student={selectedStudentForUnenroll}
        enrollments={enrollments}
        onUnenroll={handleUnenrollStudent}
        isLoading={isLoadingEnrollments}
      />
    </>
  );
};

export default AllStudentsTab;