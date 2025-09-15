
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
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
    if (!user || !user.id) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // console.log("Fetching teacher data for user ID:", user.id);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockClasses = [
          { id: "class1", name: "Web Development" },
          { id: "class2", name: "QA Testing" }
        ];
        
        const mockLessons = [
          { 
            id: "1", 
            title: "Introdução ao HTML", 
            description: "Aprenda os fundamentos do HTML", 
            youtubeUrl: "https://youtube.com/watch?v=demo1", 
            date: "2023-04-15", 
            class: "Web Development", 
            class_id: "class1", 
            visibility: "all" as 'all' | 'class_only'
          },
          { 
            id: "2", 
            title: "CSS Básico", 
            description: "Estilizando páginas web com CSS", 
            youtubeUrl: "https://youtube.com/watch?v=demo2", 
            date: "2023-04-22", 
            class: "Web Development", 
            class_id: "class1", 
            visibility: "all" as 'all' | 'class_only' 
          },
          { 
            id: "3", 
            title: "Testes Unitários", 
            description: "Implementando testes unitários", 
            youtubeUrl: "https://youtube.com/watch?v=demo3", 
            date: "2023-04-25", 
            class: "QA Testing", 
            class_id: "class2", 
            visibility: "all" as 'all' | 'class_only'
          }
        ];
        
        setAvailableClasses(mockClasses);
        setLessons(mockLessons);
        setStudentCount(45); // Mock student count
        
      } catch (error: any) {
        
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
