
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import StudentsTable from "./tables/StudentsTable";
import TeachersTable from "./tables/TeachersTable";
import CoursesTable from "./tables/CoursesTable";
import PaymentsTable from "./tables/PaymentsTable";
import EnrollmentsChart from "./EnrollmentsChart";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminData } from "@/hooks/admin/useAdminData";
import RevenueTable from "./tables/RevenueTable";

interface DashboardContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading?: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  const { 
    students, 
    teachers, 
    courses, 
    payments, 
    enrollmentStats,
    isLoading 
  } = useAdminData();

  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Garantir que os arrays estão sempre definidos
  const safePayments = Array.isArray(payments) ? payments : [];
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeStudents = Array.isArray(students) ? students : [];
  const safeTeachers = Array.isArray(teachers) ? teachers : [];

  return (
    <Card className="mt-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="students" className="p-4">
          <h2 className="text-2xl font-bold mb-4">Gestão de Alunos</h2>
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
    </Card>
  );
};

export default DashboardContent;
