
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const StudentCourseList = () => {
  const { user } = useAuth();

  // Redirect if not authenticated or not a student
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'student') {
    return <Navigate to="/teacher/dashboard" />;
  }

  // Sample courses data (in a real app, this would come from an API)
  const courses = [
    {
      id: "1",
      title: "Testes Automatizados com Cypress",
      description: "Aprenda a criar testes automatizados eficientes com Cypress",
      progress: 65,
      instructor: "Ana Paula Silva",
      startDate: "2023-06-15",
      endDate: "2023-12-15",
    },
    {
      id: "2",
      title: "QA Avançado",
      description: "Métodos avançados de garantia de qualidade de software",
      progress: 42,
      instructor: "Carlos Mendes",
      startDate: "2023-07-01",
      endDate: "2023-12-30",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow py-4">
        <div className="container-custom flex justify-between items-center">
          <h1 className="text-2xl font-bold text-bestcode-800">Meus Cursos</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Olá, {user.name}</span>
            <Link to="/student/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Painel
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Professor:</span>
                    <span className="font-medium">{course.instructor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Início:</span>
                    <span className="font-medium">
                      {new Date(course.startDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Término:</span>
                    <span className="font-medium">
                      {new Date(course.endDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Progresso:</span>
                    <span className="font-medium text-bestcode-600">
                      {course.progress}%
                    </span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-bestcode-600 hover:bg-bestcode-700">
                  Acessar Curso
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudentCourseList;
