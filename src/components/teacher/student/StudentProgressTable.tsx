
import React from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StudentProgress } from "../types/student";
import { formatDate } from "../utils/date-utils";

interface StudentProgressTableProps {
  students: StudentProgress[];
  onViewDetails: (student: StudentProgress) => void;
}

const StudentProgressTable = ({ students, onViewDetails }: StudentProgressTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Turma</TableHead>
            <TableHead>Última Atividade</TableHead>
            <TableHead>Progresso</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.className}</TableCell>
              <TableCell>{formatDate(student.lastActivity)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={student.progress} className="h-2 w-32" />
                  <span className="text-sm">{student.progress}%</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(student)}
                >
                  Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentProgressTable;
