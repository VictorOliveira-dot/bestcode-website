
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface Teacher {
  id: string;
  name: string;
}

// Mock teachers data
const MOCK_TEACHERS = [
  { id: '1', name: 'Professor Silva' },
  { id: '2', name: 'Professor Santos' },
  { id: '3', name: 'Professora Oliveira' }
];

export const useTeachers = (shouldFetch: boolean = false) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTeachers = useCallback(async () => {
    if (!shouldFetch) return;
    
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setTeachers(MOCK_TEACHERS);
    } catch (error: any) {
      console.error("Failed to fetch teachers:", error);
      toast({
        title: "Erro ao carregar professores",
        description: error.message || "Ocorreu um erro ao carregar os professores",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [shouldFetch]);

  useEffect(() => {
    if (shouldFetch) {
      fetchTeachers();
    }
  }, [shouldFetch, fetchTeachers]);

  return { teachers, isLoading, fetchTeachers };
};
