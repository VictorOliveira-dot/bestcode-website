
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
import { StudentStatusSwitch } from "../StudentStatusSwitch";
import { Link } from "react-router-dom";
import { ResponsiveTableContainer, MobileTableCard } from "@/components/ui/responsive-table";
import { useIsMobile } from "@/hooks/use-mobile";

const StudentsTable: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
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

  const desktopTable = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">#</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="hidden lg:table-cell">Matrícula</TableHead>
          <TableHead>Turmas</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student, index) => (
          <TableRow key={student.user_id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="font-medium">{student.name}</TableCell>
            <TableCell className="text-muted-foreground">{student.email}</TableCell>
            <TableCell className="hidden lg:table-cell text-muted-foreground">
              {new Date(student.created_at).toLocaleDateString('pt-BR')}
            </TableCell>
            <TableCell className="text-center font-medium">{student.classes_count}</TableCell>
            <TableCell>
              <StudentStatusSwitch
                studentId={student.user_id}
                isActive={student.is_active || false}
                studentName={student.name}
              />
            </TableCell>
            <TableCell className="text-center">
              <StudentActions
                student={{
                  user_id: student.user_id,
                  name: student.name
                }}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const mobileCards = students.map((student, index) => (
    <MobileTableCard key={student.user_id}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">#{index + 1}</p>
          <h3 className="font-medium text-lg">{student.name}</h3>
          <p className="text-sm text-muted-foreground">{student.email}</p>
        </div>
        <StudentStatusSwitch
          studentId={student.user_id}
          isActive={student.is_active || false}
          studentName={student.name}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Matrícula:</span>
          <p className="font-medium">{new Date(student.created_at).toLocaleDateString('pt-BR')}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Turmas:</span>
          <p className="font-medium">{student.classes_count}</p>
        </div>
      </div>
      
      <div className="pt-2 border-t">
        <StudentActions
          student={{
            user_id: student.user_id,
            name: student.name
          }}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </MobileTableCard>
  ));

  return (
    <ResponsiveTableContainer 
      desktopTable={desktopTable}
      mobileCards={mobileCards}
    />
  );
};

export default StudentsTable;
