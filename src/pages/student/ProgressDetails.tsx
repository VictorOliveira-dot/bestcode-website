import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth"; // Updated import path
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Clock, BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface LessonProgress {
  lessonId: string;
  watchTimeMinutes: number;
  lastWatched: string | null;
  progress: number;
  status: 'completed' | 'in_progress' | 'not_started';
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  date: string;
  class: string;
  visibility: 'all' | 'class_only';
}

const StudentProgressDetails = () => {
  const { user } = useAuth();
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [studentClass, setStudentClass] = useState("QA-01"); // Default student class

  useEffect(() => {
    // Get lessons from localStorage
    const teacherLessons = localStorage.getItem('teacher_lessons');
    if (teacherLessons) {
      setLessons(JSON.parse(teacherLessons));
    }

    // Get stored progress from localStorage
    const storedProgress = localStorage.getItem('student_progress');
    if (storedProgress) {
      setLessonProgress(JSON.parse(storedProgress));
    }
  }, []);

  // Redirect if not authenticated or not a student
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'student') {
    return <Navigate to="/teacher/dashboard" />;
  }

  // Calculate student stats
  const availableLessons = lessons.filter(lesson => 
    lesson.visibility === 'all' || lesson.class === studentClass
  );
  
  const completedLessons = lessonProgress.filter(progress => progress.status === 'completed').length;
  const inProgressLessons = lessonProgress.filter(progress => progress.status === 'in_progress').length;
  const notStartedLessons = availableLessons.length - completedLessons - inProgressLessons;
  
  // Calculate overall progress percentage
  const overallProgress = availableLessons.length > 0 
    ? Math.round((completedLessons / availableLessons.length) * 100) 
    : 0;

  // Sort lessons by most recently watched
  const sortedProgress = [...lessonProgress].sort((a, b) => {
    if (!a.lastWatched) return 1;
    if (!b.lastWatched) return -1;
    return new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime();
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow py-4">
        <div className="container-custom flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <h1 className="text-2xl font-bold text-bestcode-800">Meu Progresso</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart className="h-5 w-5 text-bestcode-600" />
                Progresso Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-bestcode-600 mb-2">{overallProgress}%</div>
              <Progress value={overallProgress} className="h-2 mb-4" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Aulas Concluídas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{completedLessons}</div>
              <div className="text-sm text-gray-500">de {availableLessons.length} aulas</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{inProgressLessons}</div>
              <div className="text-sm text-gray-500">aulas</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Não Iniciadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-500">{notStartedLessons}</div>
              <div className="text-sm text-gray-500">aulas</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes de Progresso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sortedProgress.map((progress) => {
                const lesson = lessons.find(l => l.id === progress.lessonId);
                if (!lesson) return null;
                
                return (
                  <div key={progress.lessonId} className="border-b pb-6 last:border-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                      <h3 className="font-medium">{lesson.title}</h3>
                      <span className={`text-sm px-2 py-1 rounded ${
                        progress.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {progress.status === 'completed' ? 'Concluído' : 'Em andamento'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-gray-500">Tempo assistido:</span>
                        <span className="ml-2 font-medium">{progress.watchTimeMinutes} minutos</span>
                      </div>
                      {progress.lastWatched && (
                        <div>
                          <span className="text-gray-500">Último acesso:</span>
                          <span className="ml-2 font-medium">
                            {new Date(progress.lastWatched).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{progress.progress}%</span>
                      </div>
                      <Progress value={progress.progress} className="h-2" />
                    </div>
                  </div>
                );
              })}
              
              {sortedProgress.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  Você ainda não iniciou nenhuma aula.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentProgressDetails;
