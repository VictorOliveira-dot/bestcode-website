
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import StudentSearchBar from "./student/StudentSearchBar";
import StudentProgressTable from "./student/StudentProgressTable";
import StudentDetailsModal from "./student/StudentDetailsModal";
import { generateStudentLessons } from "./utils/student-data-utils";
import { StudentProgress, LessonStatus } from "./types/student";
import { supabase } from "@/integrations/supabase/client";

const StudentProgressTracker = () => {
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [studentLessons, setStudentLessons] = useState<LessonStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Fetch students and classes from Supabase
  useEffect(() => {
    if (!user) return;
    
    const fetchStudentProgress = async () => {
      setIsLoading(true);
      try {
        // First, get classes this teacher teaches
        const { data: classesData, error: classesError } = await supabase
          .from('classes')
          .select('id, name')
          .eq('teacher_id', user.id);
        
        if (classesError) throw classesError;
        
        if (classesData && classesData.length > 0) {
          // Store available class names for filtering
          const classes = classesData.map(c => c.name);
          setAvailableClasses(classes);
          
          // Get enrollments for these classes
          const { data: enrollmentsData, error: enrollmentsError } = await supabase
            .from('enrollments')
            .select(`
              student_id,
              classes(name),
              users:student_id(name, email)
            `)
            .in('class_id', classesData.map(c => c.id));
          
          if (enrollmentsError) throw enrollmentsError;
          
          if (enrollmentsData && enrollmentsData.length > 0) {
            // For each student, get their progress
            const studentProgressData: StudentProgress[] = [];
            
            for (const enrollment of enrollmentsData) {
              if (!enrollment.users || !enrollment.classes) continue;
              
              // Get lesson progress for this student
              const { data: progressData, error: progressError } = await supabase
                .from('lesson_progress')
                .select(`
                  progress,
                  status,
                  last_watched,
                  lessons(id)
                `)
                .eq('student_id', enrollment.student_id);
              
              if (progressError) {
                console.error(`Error fetching progress for student ${enrollment.student_id}:`, progressError);
                continue;
              }
              
              // Get total lessons for this class
              const { count: totalLessons, error: countError } = await supabase
                .from('lessons')
                .select('id', { count: 'exact', head: true })
                .eq('class_id', classesData.find(c => c.name === enrollment.classes?.name)?.id);
                
              if (countError) {
                console.error(`Error counting lessons for class:`, countError);
                continue;
              }
              
              // Calculate completed lessons
              const completedLessons = progressData?.filter(p => p.status === 'completed').length || 0;
              
              // Calculate progress percentage
              const progress = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
              
              // Find last activity time
              let lastActivity = null;
              if (progressData && progressData.length > 0) {
                const sortedProgress = [...progressData].sort((a, b) => {
                  if (!a.last_watched) return 1;
                  if (!b.last_watched) return -1;
                  return new Date(b.last_watched).getTime() - new Date(a.last_watched).getTime();
                });
                
                if (sortedProgress[0]?.last_watched) {
                  lastActivity = sortedProgress[0].last_watched;
                }
              }
              
              // Add to student progress list
              studentProgressData.push({
                id: enrollment.student_id,
                name: enrollment.users.name,
                email: enrollment.users.email,
                className: enrollment.classes.name,
                lastActivity: lastActivity || new Date().toISOString(),
                completedLessons,
                totalLessons: totalLessons || 0,
                progress
              });
            }
            
            setStudents(studentProgressData);
          }
        }
      } catch (error: any) {
        console.error("Error fetching student progress:", error);
        toast({
          title: "Erro ao carregar dados dos alunos",
          description: error.message || "Ocorreu um erro ao buscar os dados dos alunos.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudentProgress();
  }, [user]);

  // Apply filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "all" || student.className === classFilter;
    return matchesSearch && matchesClass;
  });

  // For now, we'll still use the mock lesson generation function
  // In a real implementation, this would fetch actual lesson progress data
  const viewStudentDetails = (student: StudentProgress) => {
    setSelectedStudent(student);
    // For now, we still use the mock lesson generator
    // In a real implementation, you would fetch the actual lesson status from Supabase
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
