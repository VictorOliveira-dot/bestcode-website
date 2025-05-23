
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";
import StudentSearchBar from "./student/StudentSearchBar";
import StudentProgressTable from "./student/StudentProgressTable";
import StudentDetailsModal from "./student/StudentDetailsModal";
import { useStudentProgress, StudentProgressData } from "@/hooks/teacher/useStudentProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { LessonStatus } from "./types/student";

// Updated interface to match Supabase data
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
  const { students, availableClasses, isLoading, error } = useStudentProgress();
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [studentLessons, setStudentLessons] = useState<LessonStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Transform Supabase data to component format
  const transformedStudents: StudentProgress[] = students.map((student: StudentProgressData) => ({
    id: student.id,
    name: student.name,
    email: student.email,
    className: student.class_name,
    lastActivity: student.last_activity,
    completedLessons: student.completed_lessons,
    totalLessons: student.total_lessons,
    progress: student.progress
  }));

  const filteredStudents = transformedStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "all" || student.className === classFilter;
    return matchesSearch && matchesClass;
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
        <p className="text-destructive-foreground font-medium">Erro ao carregar progresso dos alunos</p>
        <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudentSearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        classFilter={classFilter}
        setClassFilter={setClassFilter}
        availableClasses={availableClasses.map(c => c.name)}
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
