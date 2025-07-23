
import React, { useEffect, useState } from "react";
import { Navigate, Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import StudentLessonsPanel from "@/components/student/StudentLessonsPanel";
import { useStudentData } from "@/hooks/student/useStudentData";

interface CourseData {
  class_id: string;
  class_name: string;
  class_description: string;
  start_date: string;
  enrollment_status: string;
  teacher_name: string;
  progress: number;
}

const StudentCourseList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lesson');
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLessons, setShowLessons] = useState(false);

  const { 
    lessons, 
    progress: lessonProgress, 
    updateProgress,
    isLoading: isLoadingLessons,
    enrollments
  } = useStudentData();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'student') {
    return <Navigate to="/teacher/dashboard" />;
  }

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        
        const { data: enrollments, error: enrollmentsError } = await supabase
          .rpc('get_student_enrollments');
        
        if (enrollmentsError) {
          throw enrollmentsError;
        }

        // console.log('📚 Course enrollments:', enrollments);

        const { data: progressData, error: progressError } = await supabase
          .rpc('get_student_progress');

        if (progressError) {
          throw progressError;
        }

        const coursesWithProgress = enrollments.map(enrollment => {
          const courseProgress = progressData
            ? progressData
                .filter(p => {
                  // Find lessons for this class and calculate progress
                  return lessons?.some(l => l.class_id === enrollment.class_id && l.id === p.lesson_id);
                })
                .reduce((avg, curr) => avg + curr.progress, 0) / 
                Math.max(1, progressData.filter(p => 
                  lessons?.some(l => l.class_id === enrollment.class_id && l.id === p.lesson_id)
                ).length)
            : 0;

          return {
            class_id: enrollment.class_id,
            class_name: enrollment.class_name,
            class_description: enrollment.class_description,
            start_date: enrollment.start_date,
            enrollment_status: enrollment.enrollment_status,
            teacher_name: enrollment.teacher_name,
            progress: Math.round(courseProgress)
          };
        });

        setCourses(coursesWithProgress);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [lessons]);

  // Effect to handle lesson parameter from schedule
  useEffect(() => {
    if (lessonId && lessons && lessons.length > 0) {
      setShowLessons(true);
      // Clear the URL parameter
      navigate('/student/courses', { replace: true });
    }
  }, [lessonId, lessons, navigate]);

  const handleAccessLessons = () => {
    setShowLessons(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow py-4">
          <div className="container-custom flex justify-between items-center">
            <h1 className="text-2xl font-bold text-bestcode-800">Meus Cursos</h1>
            <Link to="/student/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Painel
              </Button>
            </Link>
          </div>
        </header>

        <main className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-10 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Show lessons panel if requested
  if (showLessons) {
    const studentClass = enrollments && enrollments.length > 0 
      ? enrollments[0].class_name 
      : "default";

    // console.log('🎓 Showing lessons for class:', studentClass);

    const formattedLessons = Array.isArray(lessons) ? lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      youtubeUrl: lesson.youtube_url,
      date: lesson.date,
      class: lesson.class_name,
      class_id: lesson.class_id,
      visibility: lesson.visibility as 'all' | 'class_only' | 'complementary'
    })) : [];

    const formattedProgress = Array.isArray(lessonProgress) ? lessonProgress.map(p => ({
      lessonId: p.lesson_id,
      watchTimeMinutes: p.watch_time_minutes,
      progress: p.progress,
      status: p.status as 'completed' | 'in_progress' | 'not_started',
      lastWatched: p.last_watched
    })) : [];

    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow py-4">
          <div className="container-custom flex justify-between items-center">
            <h1 className="text-2xl font-bold text-bestcode-800">Minhas Aulas</h1>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowLessons(false)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar aos Cursos
              </Button>
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
          <StudentLessonsPanel
            lessons={formattedLessons}
            studentClass={studentClass}
            lessonProgress={formattedProgress}
            updateLessonProgress={updateProgress}
            isLoading={isLoadingLessons}
          />
        </main>
      </div>
    );
  }

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
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {courses.length === 0 && !isLoading && !error ? (
          <div className="text-center py-12">
            <h2 className="text-lg font-medium text-gray-700">
              Você ainda não está matriculado em nenhum curso.
            </h2>
            <p className="text-gray-500 mt-2">
              Entre em contato com o suporte para informações sobre matrículas disponíveis.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.class_id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{course.class_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{course.class_description}</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Professor:</span>
                      <span className="font-medium">{course.teacher_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Início:</span>
                      <span className="font-medium">
                        {new Date(course.start_date).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="font-medium capitalize">
                        {course.enrollment_status === "active" ? "Ativo" : course.enrollment_status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Progresso:</span>
                      <span className="font-medium text-bestcode-600">
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-bestcode-600 hover:bg-bestcode-700"
                    onClick={handleAccessLessons}
                  >
                    Acessar Aulas
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentCourseList;
