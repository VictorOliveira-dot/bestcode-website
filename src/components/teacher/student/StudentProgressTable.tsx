
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
import { convertToCSV, downloadCSV } from "../utils/csv-utils";
import { Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";

interface StudentProgressTableProps {
  students: StudentProgress[];
  onViewDetails: (student: StudentProgress) => void;
}

const StudentProgressTable = ({ students, onViewDetails }: StudentProgressTableProps) => {
  const isMobile = useIsMobile();
  
  const handleExportCSV = () => {
    if (students.length === 0) return;
    
    // Define custom headers for the CSV
    const headers = {
      id: 'ID',
      name: 'Nome',
      email: 'Email',
      className: 'Turma',
      lastActivity: 'Última Atividade',
      completedLessons: 'Aulas Concluídas',
      totalLessons: 'Total de Aulas',
      progress: 'Progresso (%)'
    };
    
    // Process data for CSV - format dates
    const csvData = students.map(student => ({
      ...student,
      lastActivity: formatDate(student.lastActivity)
    }));
    
    // Generate and download the CSV
    const csv = convertToCSV(csvData, headers);
    downloadCSV(csv, `alunos-progresso-${new Date().toISOString().split('T')[0]}.csv`);
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCSV}
            disabled={students.length === 0}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
        <div className="space-y-4">
          {students.map((student) => (
            <Card key={student.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-lg">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Turma:</span>
                      <p>{student.className}</p>
                    </div>
                    <div>
                      <span className="font-medium">Última Atividade:</span>
                      <p>{formatDate(student.lastActivity)}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-medium">Progresso:</span>
                      <span className="text-sm">{student.progress}%</span>
                    </div>
                    <Progress value={student.progress} className="h-2 mt-1" />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onViewDetails(student)}
                    className="w-full mt-2"
                  >
                    Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportCSV}
          disabled={students.length === 0}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>
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
    </div>
  );
};

export default StudentProgressTable;
