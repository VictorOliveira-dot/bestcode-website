
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Student {
  id: string;
  name: string;
  email: string;
  created_at: string;
  classes_count: number;
  last_active: string | null;
  progress_average: number;
}

export function useStudentsTable() {
  const [isSessionChecked, setIsSessionChecked] = useState(false);

  const { 
    data: students, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('admin_get_students_data');
        
        if (error) {
          console.error("Failed to fetch students:", error);
          throw error;
        }

        console.log("Students data fetched successfully:", data.length);
        return data || [];
      } catch (err: any) {
        console.error("Error fetching students:", err);
        toast({
          title: "Erro ao carregar alunos",
          description: err.message || "Não foi possível carregar a lista de alunos",
          variant: "destructive"
        });
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
