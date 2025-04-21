import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  email: string;
  created_at: string;
  classes_count: number;
  last_active: string;
  progress_average: number;
}

export const MOCK_STUDENTS: Student[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@example.com",
    created_at: "2023-02-15T08:30:00Z",
    classes_count: 2,
    last_active: "2023-04-18T14:25:00Z",
    progress_average: 75
  },
  {
    id: "2",
    name: "Bruno Santos",
    email: "bruno.santos@example.com",
    created_at: "2023-03-10T10:15:00Z",
    classes_count: 3,
    last_active: "2023-04-20T09:45:00Z",
    progress_average: 92
  },
  {
    id: "3",
    name: "Carla Oliveira",
    email: "carla.oliveira@example.com",
    created_at: "2023-01-05T11:20:00Z",
    classes_count: 1,
    last_active: "2023-04-15T16:30:00Z",
    progress_average: 45
  }
];

export function useStudentsTable() {
  const [isSessionChecked, setIsSessionChecked] = useState(false);

  const { data: students, isLoading, error, refetch } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      try {
        console.log("Fetching students data...");
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("Students data fetched successfully:", MOCK_STUDENTS.length);
        return MOCK_STUDENTS;
      } catch (err: any) {
        console.error("Failed to fetch students:", err);
        throw err;
      }
    },
    enabled: isSessionChecked
  });

  const handleViewDetails = (studentId: string) => {
    toast({
      title: "Visualizando detalhes do aluno",
      description: `Redirecionando para a página de detalhes do aluno #${studentId}`,
    });
  };

  const handleEdit = (studentId: string) => {
    toast({
      title: "Editando aluno",
      description: `Redirecionando para a página de edição do aluno #${studentId}`,
    });
  };

  const handleDelete = (studentId: string) => {
    toast({
      title: "Excluir aluno",
      description: `Confirmação para excluir o aluno #${studentId}`,
      variant: "destructive",
    });
  };

  return {
    students,
    isLoading,
    error,
    refetch,
    isSessionChecked,
    setIsSessionChecked,
    handleViewDetails,
    handleEdit,
    handleDelete
  };
}

export type { Student };
