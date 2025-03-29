
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const TeacherDashboard = () => {
  const { user, logout } = useAuth();

  // Redirect if not authenticated or not a teacher
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'teacher') {
    return <Navigate to="/student/dashboard" />;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso."
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow py-4">
        <div className="container-custom flex justify-between items-center">
          <h1 className="text-2xl font-bold text-bestcode-800">Painel do Professor</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Olá, {user.name}</span>
            <Button variant="outline" onClick={handleLogout}>Sair</Button>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Minhas Turmas</CardTitle>
              <CardDescription>Gerencie suas turmas ativas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">3 turmas</p>
              <Button className="mt-4 w-full bg-bestcode-600 hover:bg-bestcode-700">Ver Turmas</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alunos</CardTitle>
              <CardDescription>Total de alunos matriculados</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">28 alunos</p>
              <Button className="mt-4 w-full bg-bestcode-600 hover:bg-bestcode-700">Ver Alunos</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agenda</CardTitle>
              <CardDescription>Próximas aulas programadas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">2 aulas hoje</p>
              <Button className="mt-4 w-full bg-bestcode-600 hover:bg-bestcode-700">Ver Agenda</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Aulas Recentes</CardTitle>
              <CardDescription>Histórico das últimas aulas ministradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Introdução ao Teste de API</h3>
                  <p className="text-sm text-gray-600">Turma QA-01 • 15/07/2023</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Testes de Regressão</h3>
                  <p className="text-sm text-gray-600">Turma QA-02 • 14/07/2023</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Automação com Cypress</h3>
                  <p className="text-sm text-gray-600">Turma QA-01 • 13/07/2023</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
