
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, Upload, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import AdminStudentsTable from "./tables/StudentsTable";
import AdminTeachersTable from "./tables/TeachersTable";
import AdminCoursesTable from "./tables/CoursesTable";
import AdminPaymentsTable from "./tables/PaymentsTable";

interface DashboardContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminDashboardContent: React.FC<DashboardContentProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="mt-8">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 md:p-6">
          <div>
            <CardTitle>Painel de Administração</CardTitle>
            <CardDescription>Gerencie alunos, professores, cursos e pagamentos</CardDescription>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            {activeTab === "students" && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <PlusCircle className="h-4 w-4" />
                Novo Aluno
              </Button>
            )}
            {activeTab === "teachers" && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <PlusCircle className="h-4 w-4" />
                Novo Professor
              </Button>
            )}
            {activeTab === "courses" && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <PlusCircle className="h-4 w-4" />
                Novo Curso
              </Button>
            )}
            <Button 
              variant="outline" 
              className="flex items-center gap-2 w-full md:w-auto"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <Tabs defaultValue="students" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full flex flex-row mb-4 md:w-auto rounded-none md:rounded-md border-b md:border-0">
              <TabsTrigger 
                value="students" 
                className="flex-1 md:flex-none py-3 md:py-1.5 rounded-none md:rounded-md border-b-2 border-transparent data-[state=active]:border-bestcode-600 md:data-[state=active]:border-transparent"
              >
                Alunos
              </TabsTrigger>
              <TabsTrigger 
                value="teachers" 
                className="flex-1 md:flex-none py-3 md:py-1.5 rounded-none md:rounded-md border-b-2 border-transparent data-[state=active]:border-bestcode-600 md:data-[state=active]:border-transparent"
              >
                Professores
              </TabsTrigger>
              <TabsTrigger 
                value="courses" 
                className="flex-1 md:flex-none py-3 md:py-1.5 rounded-none md:rounded-md border-b-2 border-transparent data-[state=active]:border-bestcode-600 md:data-[state=active]:border-transparent"
              >
                Cursos
              </TabsTrigger>
              <TabsTrigger 
                value="payments" 
                className="flex-1 md:flex-none py-3 md:py-1.5 rounded-none md:rounded-md border-b-2 border-transparent data-[state=active]:border-bestcode-600 md:data-[state=active]:border-transparent"
              >
                Pagamentos
              </TabsTrigger>
            </TabsList>
            
            <div className="p-4 md:p-0">
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar..."
                    className="pl-8 w-full"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Importar
                </Button>
              </div>
              
              <TabsContent value="students" className="mt-0">
                <AdminStudentsTable />
              </TabsContent>
              
              <TabsContent value="teachers" className="mt-0">
                <AdminTeachersTable />
              </TabsContent>
              
              <TabsContent value="courses" className="mt-0">
                <AdminCoursesTable />
              </TabsContent>
              
              <TabsContent value="payments" className="mt-0">
                <AdminPaymentsTable />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardContent;
