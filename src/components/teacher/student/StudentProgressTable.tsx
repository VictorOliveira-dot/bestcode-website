
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FileDown } from "lucide-react";
import { StudentProgress } from "../types/student";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { exportToCsv } from "../utils/csv-utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StudentProgressTableProps {
  students: StudentProgress[];
  onViewDetails: (student: StudentProgress) => void;
  isLoading?: boolean;
}

const StudentProgressTable: React.FC<StudentProgressTableProps> = ({ 
  students, 
  onViewDetails,
  isLoading = false
}) => {
  const isMobile = useIsMobile();
  
  const handleExportCSV = () => {
    // Function from utils/csv-utils.ts
    exportToCsv(students, 'student-progress.csv');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((_, index) => (
          <Skeleton key={index} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <p className="text-muted-foreground">Nenhum aluno encontrado.</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportCSV}
            className="flex items-center gap-1"
          >
            <FileDown className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
        
        <div className="space-y-4">
          {students.map((student) => (
            <Card key={student.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onViewDetails(student)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs">
                    <span className="font-medium">Turma:</span> {student.className}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Atividade:</span> {
                      student.lastActivity 
                        ? new Date(student.lastActivity).toLocaleDateString('pt-BR')
                        : 'Nunca acessou'
                    }
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Aulas:</span> {student.completedLessons}/{student.totalLessons}
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={student.progress} className="flex-1 h-2" />
                    <span className="text-xs font-medium">{student.progress}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline"
          onClick={handleExportCSV}
          className="flex items-center gap-1"
        >
          <FileDown className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>
      
      <div className="border rounded-md overflow-x-auto">
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
                <TableCell>
                  {student.lastActivity 
                    ? new Date(student.lastActivity).toLocaleDateString('pt-BR')
                    : 'Nunca acessou'
                  }
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={student.progress} className="w-[100px] h-2" />
                    <span className="text-xs">
                      {student.completedLessons}/{student.totalLessons} ({student.progress}%)
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onViewDetails(student)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentProgressTable;
