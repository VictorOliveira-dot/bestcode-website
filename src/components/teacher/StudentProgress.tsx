
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";
import StudentSearchBar from "./student/StudentSearchBar";
import StudentProgressTable from "./student/StudentProgressTable";
import StudentDetailsModal from "./student/StudentDetailsModal";
import { generateStudentLessons } from "./utils/student-data-utils";
import { StudentProgress, LessonStatus } from "./types/student";

// Mock student data
const MOCK_STUDENTS: StudentProgress[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@example.com",
    className: "Web Development",
    lastActivity: new Date().toISOString(),
    completedLessons: 8,
    totalLessons: 12,
    progress: 67
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@example.com",
    className: "QA Testing",
    lastActivity: new Date().toISOString(),
    completedLessons: 5,
    totalLessons: 10,
    progress: 50
  }
];

const StudentProgressTracker = () => {
  const [students] = useState<StudentProgress[]>(MOCK_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [studentLessons, setStudentLessons] = useState<LessonStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [availableClasses] = useState<string[]>(["Web Development", "QA Testing"]);
  const [isLoading] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "all" || student.className === classFilter;
    return matchesSearch && matchesClass;
  });

  const viewStudentDetails = (student: StudentProgress) => {
    setSelectedStudent(student);
    const lessons = generateStudentLessons(student.id, students);
    setStudentLessons(lessons);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
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
