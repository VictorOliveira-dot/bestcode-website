
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import StudentsTable from "./tables/StudentsTable";
import TeachersTable from "./tables/TeachersTable";
import CoursesTable from "./tables/CoursesTable";
import PaymentsTable from "./tables/PaymentsTable";
import EnrollmentsChart from "./EnrollmentsChart";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminData } from "@/hooks/admin/useAdminData";
import RevenueTable from "./tables/RevenueTable";
import { EnrollStudentModal } from "./modals/EnrollStudentModal";
import { useTeacherData } from "@/hooks/teacher/useTeacherData";
import CreateEnrollmentModal from "./modals/CreateEnrollmentModal";

interface DashboardContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading?: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  
  const { 
    students, 
    teachers, 
    courses, 
    payments, 
    enrollmentStats,
    isLoading 
  } = useAdminData();

  const { allStudents } = useTeacherData();

  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Garantir que os arrays estão sempre definidos
  const safePayments = Array.isArray(payments) ? payments : [];
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeStudents = Array.isArray(students) ? students : [];
  const safeTeachers = Array.isArray(teachers) ? teachers : [];

  // Estudantes disponíveis para vincular
  const availableStudents = Array.isArray(allStudents) ? allStudents.map(student => ({
    id: student.id,
    name: student.name,
    email: student.email
  })) : [];

  return (
    <Card className="mt-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="students" className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Gestão de Alunos</h2>
            <div className="flex gap-2">
              <CreateEnrollmentModal onEnrollmentCreated={() => window.location.reload()} />
              <Button onClick={() => setIsEnrollModalOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Vincular Aluno à Turma
              </Button>
            </div>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-72 w-full" />
            </div>
          ) : (
            <StudentsTable />
          )}
        </TabsContent>
        
        <TabsContent value="teachers" className="p-4">
          <h2 className="text-2xl font-bold mb-4">Gestão de Professores</h2>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-72 w-full" />
            </div>
          ) : (
            <TeachersTable />
          )}
        </TabsContent>
        
        <TabsContent value="courses" className="p-4">
          <h2 className="text-2xl font-bold mb-4">Gestão de Turmas</h2>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-72 w-full" />
            </div>
          ) : (
            <CoursesTable />
          )}
        </TabsContent>
        
        <TabsContent value="payments" className="p-4">
          <RevenueTable />
        </TabsContent>
        
        <TabsContent value="reports" className="p-4">
          <h2 className="text-2xl font-bold mb-4">Relatórios e Análises</h2>
          {isLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <div className="grid grid-cols-1">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-4">Tendências de Matrícula</h3>
                <EnrollmentsChart 
                  month={selectedMonth} 
                  year={selectedYear} 
                />
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="enrollments" className="p-4">
          <h2 className="text-2xl font-bold mb-4">Gestão de Matrículas</h2>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-72 w-full" />
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Exibindo {safePayments.length} matrículas ativas</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <EnrollStudentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        availableStudents={availableStudents}
      />
    </Card>
  );
};

export default DashboardContent;
