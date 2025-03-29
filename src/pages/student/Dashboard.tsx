
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const StudentDashboard = () => {
  const { user, logout } = useAuth();

  // Redirect if not authenticated or not a student
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'student') {
    return <Navigate to="/teacher/dashboard" />;
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
          <h1 className="text-2xl font-bold text-bestcode-800">Painel do Aluno</h1>
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
              <CardTitle>Meus Cursos</CardTitle>
              <CardDescription>Cursos em andamento</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">2 cursos</p>
              <Button className="mt-4 w-full bg-bestcode-600 hover:bg-bestcode-700">Ver Cursos</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Aulas</CardTitle>
              <CardDescription>Aulas agendadas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1 aula hoje</p>
              <Button className="mt-4 w-full bg-bestcode-600 hover:bg-bestcode-700">Ver Agenda</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progresso</CardTitle>
              <CardDescription>Seu progresso geral</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">70% completo</p>
              <Button className="mt-4 w-full bg-bestcode-600 hover:bg-bestcode-700">Ver Detalhes</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Cursos em Andamento</CardTitle>
              <CardDescription>Continue de onde parou</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Formação QA</h3>
                  <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-2 bg-bestcode-600 rounded-full w-[75%]"></div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">75% completo</p>
                  <Button className="mt-2" variant="outline" size="sm">Continuar</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Automação de Testes</h3>
                  <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-2 bg-bestcode-600 rounded-full w-[30%]"></div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">30% completo</p>
                  <Button className="mt-2" variant="outline" size="sm">Continuar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
