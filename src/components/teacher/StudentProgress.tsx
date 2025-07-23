
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";
import StudentSearchBar from "./student/StudentSearchBar";
import StudentProgressTable from "./student/StudentProgressTable";
import StudentDetailsModal from "./student/StudentDetailsModal";
import { useStudentProgress } from "@/hooks/teacher/useStudentProgress";
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
  const { students, availableClasses, isLoading, error, fetchStudentLessonDetails } = useStudentProgress();
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [studentLessons, setStudentLessons] = useState<LessonStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Transform students data to component format
  const transformedStudents: StudentProgress[] = students.map((student: any) => ({
    id: student.id,
    name: student.name,
    email: student.email,
    className: student.class_name || "Sem turma",
    lastActivity: student.last_activity,
    completedLessons: student.completed_lessons || 0,
    totalLessons: student.total_lessons || 0,
    progress: Math.round(student.progress || 0)
  }));

  const filteredStudents = transformedStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const viewStudentDetails = async (student: StudentProgress) => {
    setSelectedStudent(student);
    
    try {
      const lessonDetails = await fetchStudentLessonDetails(student.id);
      
      // Transform lesson details to match LessonStatus interface
      const transformedLessons: LessonStatus[] = lessonDetails.map(lesson => ({
        id: lesson.lesson_id,
        title: lesson.lesson_title,
        date: lesson.lesson_date,
        status: lesson.status as "completed" | "in_progress" | "not_started",
        watchTimeMinutes: lesson.watch_time_minutes,
        lastWatch: lesson.last_watch
      }));
      
      setStudentLessons(transformedLessons);
    } catch (error) {
      console.error("Error fetching student lesson details:", error);
      // toast({
      //   title: "Erro ao carregar detalhes",
      //   description: "Não foi possível carregar os detalhes do aluno.",
      //   variant: "destructive"
      // });
      
      // Set empty lessons on error
      setStudentLessons([]);
    }
    
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
        <h2 className="text-xl font-semibold">Meus Alunos ({transformedStudents.length})</h2>
      </div>

      <StudentSearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        classFilter={classFilter}
        setClassFilter={setClassFilter}
        availableClasses={availableClasses}
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
