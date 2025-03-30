import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, BookOpen, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface StudentProgress {
  id: string;
  name: string;
  email: string;
  className: string;
  lastActivity: string;
  completedLessons: number;
  totalLessons: number;
  progress: number; // Percentage of completion
}

interface LessonStatus {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'in_progress' | 'not_started';
  watchTimeMinutes: number;
  lastWatch: string | null;
}

const StudentProgressTracker = () => {
  const [students, setStudents] = useState<StudentProgress[]>(() => {
    const savedStudents = localStorage.getItem('teacher_students_progress');
    return savedStudents ? JSON.parse(savedStudents) : [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        className: 'QA-01',
        lastActivity: '2023-10-15T18:30:00',
        completedLessons: 8,
        totalLessons: 12,
        progress: 67
      },
      {
        id: '2',
        name: 'Maria Oliveira',
        email: 'maria.oliveira@email.com',
        className: 'QA-01',
        lastActivity: '2023-10-14T10:15:00',
        completedLessons: 6,
        totalLessons: 12,
        progress: 50
      },
      {
        id: '3',
        name: 'Carlos Souza',
        email: 'carlos.souza@email.com',
        className: 'QA-02',
        lastActivity: '2023-10-16T14:22:00',
        completedLessons: 9,
        totalLessons: 15,
        progress: 60
      },
      {
        id: '4',
        name: 'Ana Pereira',
        email: 'ana.pereira@email.com',
        className: 'DEV-01',
        lastActivity: '2023-10-15T11:45:00',
        completedLessons: 12,
        totalLessons: 18,
        progress: 67
      },
      {
        id: '5',
        name: 'Rafael Lima',
        email: 'rafael.lima@email.com',
        className: 'DEV-02',
        lastActivity: '2023-10-13T09:20:00',
        completedLessons: 5,
        totalLessons: 14,
        progress: 36
      }
    ];
  });

  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [studentLessons, setStudentLessons] = useState<LessonStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const isMobile = useIsMobile();

  const availableClasses = [...new Set(students.map(student => student.className))];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "all" || student.className === classFilter;
    return matchesSearch && matchesClass;
  });

  const generateStudentLessons = (studentId: string): LessonStatus[] => {
    const student = students.find(s => s.id === studentId);
    if (!student) return [];

    const mockLessons: LessonStatus[] = [];
    const totalLessons = student.totalLessons;
    
    for (let i = 1; i <= totalLessons; i++) {
      let status: 'completed' | 'in_progress' | 'not_started';
      let watchTimeMinutes = 0;
      let lastWatch: string | null = null;
      
      if (i <= student.completedLessons) {
        status = 'completed';
        watchTimeMinutes = Math.floor(Math.random() * 30) + 15; // 15-45 minutes
        
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
        lastWatch = randomDate.toISOString();
      } else if (i === student.completedLessons + 1) {
        status = 'in_progress';
        watchTimeMinutes = Math.floor(Math.random() * 15); // 0-15 minutes
        
        lastWatch = student.lastActivity;
      } else {
        status = 'not_started';
        watchTimeMinutes = 0;
        lastWatch = null;
      }
      
      mockLessons.push({
        id: `${studentId}-lesson-${i}`,
        title: `Aula ${i}: ${i <= 3 ? 'Introdução' : i <= 7 ? 'Conceitos Básicos' : 'Avançado'} ${i}`,
        date: new Date(Date.now() - (totalLessons - i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status,
        watchTimeMinutes,
        lastWatch
      });
    }
    
    return mockLessons;
  };

  const viewStudentDetails = (student: StudentProgress) => {
    setSelectedStudent(student);
    const lessons = generateStudentLessons(student.id);
    setStudentLessons(lessons);
    setIsDetailModalOpen(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Progresso dos Alunos</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Buscar aluno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <select
            className="border rounded p-2"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="all">Todas as Turmas</option>
            {availableClasses.map(className => (
              <option key={className} value={className}>{className}</option>
            ))}
          </select>
        </div>
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
            {filteredStudents.map((student) => (
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
                    onClick={() => viewStudentDetails(student)}
                  >
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className={isMobile ? "w-full max-w-full h-[90vh] sm:h-auto sm:max-w-4xl" : "max-w-4xl"}>
          <DialogHeader>
            <DialogTitle>
              {selectedStudent?.name} - Progresso do Aluno
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] pr-3">
            {selectedStudent && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-100 p-4 rounded">
                    <div className="text-sm text-gray-500">Aluno</div>
                    <div className="font-medium">{selectedStudent.name}</div>
                    <div className="text-sm mt-1">{selectedStudent.email}</div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded">
                    <div className="text-sm text-gray-500">Turma</div>
                    <div className="font-medium">{selectedStudent.className}</div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded">
                    <div className="text-sm text-gray-500">Progresso Geral</div>
                    <div className="font-medium">{selectedStudent.progress}%</div>
                    <Progress value={selectedStudent.progress} className="h-2 mt-2" />
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
                        {studentLessons.map((lesson) => (
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
            )}
          </ScrollArea>

          <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
            <Button 
              variant="outline" 
              onClick={() => setIsDetailModalOpen(false)}
              className={isMobile ? "w-full" : ""}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentProgressTracker;
