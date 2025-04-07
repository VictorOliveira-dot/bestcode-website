
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Lesson } from "@/components/student/types/lesson";

export interface Class {
  id: string;
  name: string;
}

export function useDashboardData() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [availableClasses, setAvailableClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching teacher data for user ID:", user.id);
        
        // Fetch classes - Using the new security policy
        const { data: classesData, error: classesError } = await supabase
          .from('classes')
          .select('id, name')
          .eq('teacher_id', user.id);
          
        if (classesError) {
          console.error("Error fetching classes:", classesError);
          throw classesError;
        }
        
        console.log("Classes fetched:", classesData?.length || 0);
        
        if (classesData && classesData.length > 0) {
          setAvailableClasses(classesData);
          
          // Fetch lessons
          const { data: lessonsData, error: lessonsError } = await supabase
            .from('lessons')
            .select(`
              id,
              title,
              description,
              youtube_url,
              date,
              class_id,
              visibility,
              classes(name)
            `)
            .in('class_id', classesData.map(c => c.id));
          
          if (lessonsError) {
            console.error("Error fetching lessons:", lessonsError);
            throw lessonsError;
          }
          
          if (lessonsData) {
            console.log("Lessons fetched:", lessonsData.length);
            
            const formattedLessons: Lesson[] = lessonsData.map(lesson => ({
              id: lesson.id,
              title: lesson.title,
              description: lesson.description,
              youtubeUrl: lesson.youtube_url,
              date: lesson.date,
              class: lesson.classes?.name || 'Sem turma',
              class_id: lesson.class_id || '',
              visibility: lesson.visibility === 'all' ? 'all' : 'class_only'
            }));
            
            setLessons(formattedLessons);
          }
          
          // Count students enrolled in teacher's classes
          let totalStudents = 0;
          for (const cls of classesData) {
            const { count, error: countError } = await supabase
              .from('enrollments')
              .select('id', { count: 'exact', head: true })
              .eq('class_id', cls.id);
              
            if (!countError && count !== null) {
              totalStudents += count;
            }
          }
          
          setStudentCount(totalStudents);
        } else {
          console.log("No classes found for this teacher");
          setAvailableClasses([]);
          setLessons([]);
        }
      } catch (error: any) {
        console.error("Error fetching teacher data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: error.message || "Ocorreu um erro ao carregar os dados.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  return {
    lessons,
    setLessons,
    availableClasses,
    studentCount,
    isLoading,
  };
}
