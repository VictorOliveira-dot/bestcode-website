
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import StudentsTable from "./tables/StudentsTable";
import TeachersTable from "./tables/TeachersTable";
import CoursesTable from "./tables/CoursesTable";
import PaymentsTable from "./tables/PaymentsTable";
import EnrollmentsChart from "./EnrollmentsChart";
import { Skeleton } from "@/components/ui/skeleton"; 

interface DashboardContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading?: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  activeTab, 
  setActiveTab,
  isLoading = false
}) => {
  // Default to current month and year for the enrollment chart
  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + 1); // JavaScript months are 0-indexed
  const currentYear = currentDate.getFullYear();
  
  return (
    <Card className="mt-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="students">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-80 w-full" />
            </div>
          ) : (
            <StudentsTable />
          )}
        </TabsContent>
        
        <TabsContent value="teachers">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-80 w-full" />
            </div>
          ) : (
            <TeachersTable />
          )}
        </TabsContent>
        
        <TabsContent value="courses">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-80 w-full" />
            </div>
          ) : (
            <CoursesTable />
          )}
        </TabsContent>
        
        <TabsContent value="payments">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-80 w-full" />
            </div>
          ) : (
            <PaymentsTable />
          )}
        </TabsContent>
        
        <TabsContent value="reports">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-80 w-full" />
            </div>
          ) : (
            <EnrollmentsChart month="all" year={currentYear} />
          )}
        </TabsContent>

        <TabsContent value="enrollments">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-80 w-full" />
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Matrículas</h2>
              <p>Gerenciamento de matrículas de alunos.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default DashboardContent;
