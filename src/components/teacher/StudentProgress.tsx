
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import StudentSearchBar from "./student/StudentSearchBar";
import StudentProgressTable from "./student/StudentProgressTable";
import StudentDetailsModal from "./student/StudentDetailsModal";
import { generateStudentLessons } from "./utils/student-data-utils";
import { StudentProgress, LessonStatus } from "./types/student";

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
