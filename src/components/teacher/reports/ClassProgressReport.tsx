import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Download, 
  Eye, 
  Clock, 
  CheckCircle,
  PlayCircle,
  XCircle,
  BarChart3 
} from "lucide-react";
import { useStudentProgress } from "@/hooks/teacher/useStudentProgress";
import { Skeleton } from "@/components/ui/skeleton";

const ClassProgressReport = () => {
  const { students, isLoading } = useStudentProgress();

  const getStatusColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusIcon = (progress: number) => {
    if (progress >= 80) return <CheckCircle className="h-4 w-4" />;
    if (progress >= 50) return <PlayCircle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  const formatLastActivity = (date: string | null) => {
    if (!date) return "Nunca";
    
    const lastActive = new Date(date);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Hoje";
    if (diffInDays === 1) return "Ontem";
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
    return `${Math.floor(diffInDays / 30)} meses atrás`;
  };

  const handleExportCSV = () => {
    if (!students) return;

    const csvContent = [
      ["Nome", "Email", "Turma", "Aulas Concluídas", "Total de Aulas", "Progresso (%)", "Última Atividade"],
      ...students.map(student => [
        student.name,
        student.email,
        student.class_name,
        student.completed_lessons.toString(),
        student.total_lessons.toString(),
        Math.round(student.progress).toString(),
        formatLastActivity(student.last_activity)
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_progresso_turma_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Progresso da Turma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const averageProgress = students?.length 
    ? students.reduce((acc, s) => acc + s.progress, 0) / students.length 
    : 0;

  const activeStudents = students?.filter(s => s.last_activity && 
    (new Date().getTime() - new Date(s.last_activity).getTime()) < 7 * 24 * 60 * 60 * 1000
  ).length || 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Relatório de Progresso da Turma
            </CardTitle>
            <Button onClick={handleExportCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total de Alunos</p>
                    <p className="text-2xl font-bold">{students?.length || 0}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Progresso Médio</p>
                    <p className="text-2xl font-bold">{Math.round(averageProgress)}%</p>
                  </div>
                  <PlayCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Alunos Ativos (7 dias)</p>
                    <p className="text-2xl font-bold">{activeStudents}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Aulas Concluídas</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Última Atividade</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students?.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-gray-600">{student.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.class_name}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{student.completed_lessons}</span>
                        <span className="text-gray-500">/ {student.total_lessons}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {Math.round(student.progress)}%
                          </span>
                          {getStatusIcon(student.progress)}
                        </div>
                        <Progress 
                          value={student.progress} 
                          className="h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {formatLastActivity(student.last_activity)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={`${getStatusColor(student.progress)} text-white`}
                      >
                        {student.progress >= 80 ? 'Excelente' :
                         student.progress >= 50 ? 'Em Progresso' : 'Precisa Atenção'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {!students || students.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum aluno encontrado nesta turma
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassProgressReport;