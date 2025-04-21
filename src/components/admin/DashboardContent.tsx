
import React from "react";
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
  return (
    <Card className="mt-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="students" className="p-4">
          <h2 className="text-2xl font-bold mb-4">Students Management</h2>
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
          <h2 className="text-2xl font-bold mb-4">Teachers Management</h2>
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
          <h2 className="text-2xl font-bold mb-4">Courses Management</h2>
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
          <h2 className="text-2xl font-bold mb-4">Payments Overview</h2>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-72 w-full" />
            </div>
          ) : (
            <PaymentsTable />
          )}
        </TabsContent>
        
        <TabsContent value="reports" className="p-4">
          <h2 className="text-2xl font-bold mb-4">Reports and Analytics</h2>
          {isLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <div className="grid grid-cols-1">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-4">Enrollment Trends</h3>
                <EnrollmentsChart />
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="enrollments" className="p-4">
          <h2 className="text-2xl font-bold mb-4">Enrollment Management</h2>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-72 w-full" />
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Enrollment management coming soon.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default DashboardContent;
