import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Search, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle,
  PlayCircle,
  XCircle 
} from "lucide-react";
import { useStudentsTable } from "@/hooks/admin/useStudentsTable";
import { Skeleton } from "@/components/ui/skeleton";

const StudentProgressReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { students, isLoading } = useStudentsTable();

  const filteredStudents = students?.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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

  const formatLastActive = (date: string | null) => {
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
      ["Nome", "Email", "Turmas", "Progresso (%)", "Última Atividade", "Data de Cadastro"],
      ...students.map(student => [
        student.name,
        student.email,
        student.classes_count.toString(),
        Math.round(student.progress_average).toString(),
        formatLastActive(student.last_active),
        new Date(student.created_at).toLocaleDateString('pt-BR')
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_progresso_alunos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Progresso dos Alunos</CardTitle>
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Relatório de Progresso dos Alunos
            </CardTitle>
            <Button onClick={handleExportCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Pesquisar alunos por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

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
                    <p className="text-2xl font-bold">
                      {students?.length 
                        ? Math.round(students.reduce((acc, s) => acc + s.progress_average, 0) / students.length)
                        : 0}%
                    </p>
                  </div>
                  <PlayCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Alunos Ativos</p>
                    <p className="text-2xl font-bold">
                      {students?.filter(s => s.last_active && 
                        (new Date().getTime() - new Date(s.last_active).getTime()) < 7 * 24 * 60 * 60 * 1000
                      ).length || 0}
                    </p>
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
                  <TableHead>Turmas</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Última Atividade</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.user_id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-gray-600">{student.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {student.classes_count} turma{student.classes_count !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {Math.round(student.progress_average)}%
                          </span>
                          {getStatusIcon(student.progress_average)}
                        </div>
                        <Progress 
                          value={student.progress_average} 
                          className="h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {formatLastActive(student.last_active)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={`${getStatusColor(student.progress_average)} text-white`}
                      >
                        {student.progress_average >= 80 ? 'Excelente' :
                         student.progress_average >= 50 ? 'Em Progresso' : 'Precisa Atenção'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm 
                  ? `Nenhum aluno encontrado para "${searchTerm}"`
                  : "Nenhum aluno cadastrado"
                }
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProgressReport;