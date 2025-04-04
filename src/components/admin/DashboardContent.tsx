
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, Upload, Search, FileText, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import AdminStudentsTable from "./tables/StudentsTable";
import AdminTeachersTable from "./tables/TeachersTable";
import AdminCoursesTable from "./tables/CoursesTable";
import AdminPaymentsTable from "./tables/PaymentsTable";
import { toast } from "@/hooks/use-toast";
import { convertToCSV, downloadCSV } from "../teacher/utils/csv-utils";
import EnrollmentsChart from "./EnrollmentsChart";

interface DashboardContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminDashboardContent: React.FC<DashboardContentProps> = ({
  activeTab,
  setActiveTab
}) => {
  const [month, setMonth] = useState<string>("all");
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());

  const handleExport = () => {
    let filename = `${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
    let data: any[] = [];
    
    // Sample data for demonstration - in a real application, this would come from your API
    switch(activeTab) {
      case "students":
        data = [
          { id: 1, name: "Ana Silva", email: "ana@example.com", course: "Desenvolvimento Web", status: "Ativo" },
          { id: 2, name: "Carlos Santos", email: "carlos@example.com", course: "QA Testing", status: "Ativo" },
          { id: 3, name: "Mariana Costa", email: "mari@example.com", course: "UX Design", status: "Pendente" }
        ];
        break;
      case "teachers":
        data = [
          { id: 1, name: "Prof. Roberto Alves", email: "roberto@example.com", specialty: "Front-end", courses: 3 },
          { id: 2, name: "Profa. Julia Lima", email: "julia@example.com", specialty: "Back-end", courses: 2 }
        ];
        break;
      case "courses":
        data = [
          { id: 1, title: "Desenvolvimento Web Fullstack", students: 15, teacher: "Prof. Roberto Alves", status: "Em andamento" },
          { id: 2, title: "QA e Testes Automatizados", students: 8, teacher: "Profa. Julia Lima", status: "Em andamento" }
        ];
        break;
      case "payments":
        data = [
          { id: 1, student: "Ana Silva", amount: "R$ 1.200,00", date: "2025-03-15", method: "Cartão de Crédito", status: "Pago" },
          { id: 2, student: "Carlos Santos", amount: "R$ 1.200,00", date: "2025-03-20", method: "Boleto", status: "Pendente" }
        ];
        break;
      case "enrollments":
        data = [
          { id: 1, student: "Ana Silva", course: "Desenvolvimento Web", date: "2025-02-10", value: "R$ 1.200,00", status: "Confirmada" },
          { id: 2, student: "Carlos Santos", course: "QA Testing", date: "2025-03-05", value: "R$ 1.200,00", status: "Confirmada" }
        ];
        break;
    }
    
    if (data.length > 0) {
      const csvContent = convertToCSV(data);
      downloadCSV(csvContent, filename);
      
      toast({
        title: "Exportação concluída",
        description: `Os dados foram exportados para ${filename}`,
      });
    }
  };
  
  const handleAddNew = () => {
    toast({
      title: `Adicionar novo ${activeTab === "students" ? "aluno" : 
                             activeTab === "teachers" ? "professor" :
                             activeTab === "courses" ? "curso" : 
                             activeTab === "payments" ? "pagamento" : "registro"}`,
      description: "Esta funcionalidade será implementada em breve.",
    });
  };
  
  const handleViewReceipt = (id: number) => {
    toast({
      title: "Visualizar Recibo",
      description: `Recibo #${id} será exibido em uma nova janela.`,
    });
  };

  return (
    <div className="mt-8">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 md:p-6">
          <div>
            <CardTitle>
              {activeTab === "students" ? "Alunos" : 
               activeTab === "teachers" ? "Professores" : 
               activeTab === "courses" ? "Cursos" : 
               activeTab === "payments" ? "Pagamentos" :
               activeTab === "enrollments" ? "Matrículas" : "Relatórios"}
            </CardTitle>
            <CardDescription>
              {activeTab === "students" ? "Gerencie os alunos matriculados" :
               activeTab === "teachers" ? "Gerencie os professores da escola" :
               activeTab === "courses" ? "Gerencie os cursos disponíveis" :
               activeTab === "payments" ? "Gerencie os pagamentos realizados" :
               activeTab === "enrollments" ? "Acompanhe as matrículas realizadas" : "Acesse os relatórios do sistema"}
            </CardDescription>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            {activeTab !== "reports" && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 w-full md:w-auto"
                onClick={handleAddNew}
              >
                <PlusCircle className="h-4 w-4" />
                {activeTab === "students" ? "Novo Aluno" :
                 activeTab === "teachers" ? "Novo Professor" :
                 activeTab === "courses" ? "Novo Curso" :
                 activeTab === "payments" ? "Novo Pagamento" : "Nova Matrícula"}
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 w-full md:w-auto"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 md:p-6">
          {activeTab === "enrollments" ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar matrículas..."
                    className="pl-8 w-full"
                  />
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Mês" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os meses</SelectItem>
                      <SelectItem value="1">Janeiro</SelectItem>
                      <SelectItem value="2">Fevereiro</SelectItem>
                      <SelectItem value="3">Março</SelectItem>
                      <SelectItem value="4">Abril</SelectItem>
                      <SelectItem value="5">Maio</SelectItem>
                      <SelectItem value="6">Junho</SelectItem>
                      <SelectItem value="7">Julho</SelectItem>
                      <SelectItem value="8">Agosto</SelectItem>
                      <SelectItem value="9">Setembro</SelectItem>
                      <SelectItem value="10">Outubro</SelectItem>
                      <SelectItem value="11">Novembro</SelectItem>
                      <SelectItem value="12">Dezembro</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <EnrollmentsChart month={month} year={parseInt(year)} />
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Aluno</th>
                      <th className="text-left py-3 px-4">Curso</th>
                      <th className="text-left py-3 px-4">Data</th>
                      <th className="text-left py-3 px-4">Valor</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-right py-3 px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">1</td>
                      <td className="py-3 px-4">Ana Silva</td>
                      <td className="py-3 px-4">Desenvolvimento Web</td>
                      <td className="py-3 px-4">10/02/2025</td>
                      <td className="py-3 px-4">R$ 1.200,00</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Confirmada</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewReceipt(1)}>
                          <Eye className="h-4 w-4 mr-1" /> Ver
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">2</td>
                      <td className="py-3 px-4">Carlos Santos</td>
                      <td className="py-3 px-4">QA Testing</td>
                      <td className="py-3 px-4">05/03/2025</td>
                      <td className="py-3 px-4">R$ 1.200,00</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Confirmada</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewReceipt(2)}>
                          <Eye className="h-4 w-4 mr-1" /> Ver
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="hidden">
                <TabsTrigger value="students">Alunos</TabsTrigger>
                <TabsTrigger value="teachers">Professores</TabsTrigger>
                <TabsTrigger value="courses">Cursos</TabsTrigger>
                <TabsTrigger value="payments">Pagamentos</TabsTrigger>
                <TabsTrigger value="reports">Relatórios</TabsTrigger>
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
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">ID</th>
                          <th className="text-left py-3 px-4">Aluno</th>
                          <th className="text-left py-3 px-4">Valor</th>
                          <th className="text-left py-3 px-4">Data</th>
                          <th className="text-left py-3 px-4">Método</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-right py-3 px-4">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">1</td>
                          <td className="py-3 px-4">Ana Silva</td>
                          <td className="py-3 px-4">R$ 1.200,00</td>
                          <td className="py-3 px-4">15/03/2025</td>
                          <td className="py-3 px-4">Cartão de Crédito</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Pago</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewReceipt(1)}>
                              <FileText className="h-4 w-4 mr-1" /> Recibo
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">2</td>
                          <td className="py-3 px-4">Carlos Santos</td>
                          <td className="py-3 px-4">R$ 1.200,00</td>
                          <td className="py-3 px-4">20/03/2025</td>
                          <td className="py-3 px-4">Boleto</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pendente</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm" disabled>
                              <FileText className="h-4 w-4 mr-1" /> Recibo
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="reports" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Relatório de Matrículas</CardTitle>
                        <CardDescription>Matrículas realizadas por período</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button onClick={handleExport} className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Exportar Relatório
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Relatório Financeiro</CardTitle>
                        <CardDescription>Receitas e pagamentos</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button onClick={handleExport} className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Exportar Relatório
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardContent;
