
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useStudentData } from "@/hooks/student/useStudentData";
import StudentDocumentation from "@/components/student/StudentDocumentation";
import { useState } from "react";

const StudentSchedule = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { lessons, isLoading, enrollments } = useStudentData();
  const [showDocumentation, setShowDocumentation] = useState(false);

  // Redirect if not authenticated or not a student
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'student') {
    return <Navigate to="/teacher/dashboard" />;
  }

  // Get student class name from enrollments
  const studentClass = enrollments && enrollments.length > 0 
    ? enrollments[0].class_name 
    : "default";

  // console.log('📅 Schedule - Student class:', studentClass);

  // Transform lessons data for schedule display
  const scheduleItems = Array.isArray(lessons) ? lessons
    .filter(lesson => {
      const isForThisClass = lesson.class_name === studentClass;
      const isForAll = lesson.visibility === 'all';
      return isForThisClass || isForAll;
    })
    .map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      type: "Aula",
      date: `${lesson.date}T10:00:00`, // Default time since we don't have specific time in lessons
      duration: 90, // Default duration
      instructor: lesson.class_name ? `Turma: ${lesson.class_name}` : null,
      description: lesson.description
    })) : [];

  // console.log('📅 Schedule items:', scheduleItems.length);

  // Sort items by date (most recent first)
  const sortedItems = [...scheduleItems].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleViewLesson = (lessonId: string) => {
    // Navigate to courses page and trigger lesson view
    navigate(`/student/courses?lesson=${lessonId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow py-4">
          <div className="container-custom flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <h1 className="text-2xl font-bold text-bestcode-800">Minha Agenda</h1>
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
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Carregando agenda...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow py-4">
        <div className="container-custom flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <h1 className="text-2xl font-bold text-bestcode-800">Minha Agenda</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDocumentation(true)}
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Documentação
            </Button>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-bestcode-600" />
              Próximas Atividades
              <span className="text-sm font-normal text-gray-500 ml-2">
                - Turma: {studentClass}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedItems.length > 0 ? (
                sortedItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h3 className="font-medium">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(item.date).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTime(item.date)}
                        </span>
                        {item.duration && (
                          <span>{item.duration} minutos</span>
                        )}
                        {item.instructor && (
                          <span>{item.instructor}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <span className="px-2 py-1 bg-bestcode-100 text-bestcode-800 rounded text-xs">
                        {item.type}
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewLesson(item.id)}
                        className="bg-bestcode-600 text-white hover:bg-bestcode-700"
                      >
                        Ver Aula
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma aula programada encontrada para sua turma: {studentClass}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <StudentDocumentation 
        isOpen={showDocumentation}
        onClose={() => setShowDocumentation(false)}
      />
    </div>
  );
};

export default StudentSchedule;
