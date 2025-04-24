
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { StudentActions } from "./StudentActions";
import { useStudentsTable } from "@/hooks/admin/useStudentsTable";
import StudentProgress from "./StudentProgress";
import { Link } from "react-router-dom";

const StudentsTable: React.FC = () => {
  const { user } = useAuth();
  const {
    students,
    isLoading,
    error,
    handleViewDetails,
    handleEdit,
    handleDelete
  } = useStudentsTable();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 border border-red-300 rounded-md bg-red-50">
        <h3 className="text-lg font-medium mb-2">Erro ao carregar alunos</h3>
        <p>{(error as Error).message}</p>
        <Button variant="secondary" className="mt-4">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <p className="text-muted-foreground">Nenhum aluno encontrado no sistema.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Matrícula</TableHead>
            <TableHead>Turmas</TableHead>
            <TableHead className="hidden md:table-cell">Última Atividade</TableHead>
            <TableHead>Progresso</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => (
            <TableRow key={student.user_id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(student.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>{student.classes_count}</TableCell>
              <TableCell className="hidden md:table-cell">
                {student.last_active ? new Date(student.last_active).toLocaleDateString('pt-BR') : 'Nunca'}
              </TableCell>
              <TableCell>
                <StudentProgress
                  completedLessons={Math.round((student.progress_average / 100) * student.classes_count)}
                  totalLessons={student.classes_count}
                  progress={student.progress_average}
                />
              </TableCell>
              <TableCell className="text-right">
                <StudentActions
                  studentId={student.user_id}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentsTable;
