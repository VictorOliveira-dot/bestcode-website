
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";
import StudentSearchBar from "./student/StudentSearchBar";
import StudentProgressTable from "./student/StudentProgressTable";
import StudentDetailsModal from "./student/StudentDetailsModal";
import { useTeacherData } from "@/hooks/teacher/useTeacherData";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { LessonStatus } from "./types/student";

interface StudentProgress {
  id: string;
  name: string;
  email: string;
  className: string;
  lastActivity: string | null;
  completedLessons: number;
  totalLessons: number;
  progress: number;
}

const StudentProgressTracker = () => {
  const { allStudents, classes, isLoading, error } = useTeacherData();
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [studentLessons, setStudentLessons] = useState<LessonStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Transform students data to component format
  const transformedStudents: StudentProgress[] = allStudents.map((student: any) => ({
    id: student.id,
    name: student.name,
    email: student.email,
    className: "Todas as turmas", // Since we're showing all students
    lastActivity: null, // This would need to be fetched separately if needed
    completedLessons: 0, // This would need to be calculated if needed
    totalLessons: 0, // This would need to be calculated if needed
    progress: 0 // This would need to be calculated if needed
  }));

  const filteredStudents = transformedStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const viewStudentDetails = async (student: StudentProgress) => {
    setSelectedStudent(student);
    
    // Generate mock lesson data matching the imported LessonStatus interface
    const mockLessons: LessonStatus[] = [
      {
        id: "1",
        title: "Introdução ao Curso",
        date: "2024-01-15",
        status: "completed",
        watchTimeMinutes: 45,
        lastWatch: "2024-01-15T10:30:00Z"
      },
      {
        id: "2", 
        title: "Fundamentos",
        date: "2024-01-16",
        status: "in_progress",
        watchTimeMinutes: 25,
        lastWatch: "2024-01-16T14:20:00Z"
      },
      {
        id: "3",
        title: "Projeto Prático",
        date: "2024-01-17",
        status: "not_started",
        watchTimeMinutes: 0,
        lastWatch: null
      }
    ];
    
    setStudentLessons(mockLessons);
    setIsDetailModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 border rounded-md bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive mx-auto mb-2" />
        <p className="text-destructive-foreground font-medium">Erro ao carregar dados dos alunos</p>
        <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Todos os Alunos ({allStudents.length})</h2>
      </div>

      <StudentSearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        classFilter={classFilter}
        setClassFilter={setClassFilter}
        availableClasses={[]}
      />

      <StudentProgressTable 
        students={filteredStudents}
        onViewDetails={viewStudentDetails}
        isLoading={isLoading}
      />

      <StudentDetailsModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        student={selectedStudent}
        lessonStatuses={studentLessons}
        isMobile={isMobile}
      />
    </div>
  );
};

export default StudentProgressTracker;
