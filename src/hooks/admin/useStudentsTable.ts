
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

export interface Student {
  user_id: string;
  name: string;
  email: string;
  created_at: string;
  classes_count: number;
  last_active: string | null;
  progress_average: number;
  is_active?: boolean;
}

export function useStudentsTable() {
  const { user, loading: authLoading } = useAuth();

  const { 
    data: students, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: async () => {
      try {
        // Primeiro buscar dados básicos dos alunos
        const { data: studentsData, error: studentsError } = await supabase.rpc('admin_get_students_data');
        
        if (studentsError) {
          console.error("Failed to fetch students:", studentsError);
          throw studentsError;
        }

        // Buscar informações adicionais incluindo is_active
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, is_active')
          .eq('role', 'student');

        if (usersError) {
          console.error("Failed to fetch users data:", usersError);
          throw usersError;
        }

        // Combinar os dados
        const combinedData = studentsData.map(student => {
          const userInfo = usersData.find(user => user.id === student.user_id);
          return {
            ...student,
            is_active: userInfo?.is_active || false
          };
        });

        console.log("Students data fetched successfully:", combinedData.length);
        return combinedData || [];
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
    enabled: !authLoading && user?.role === 'admin'
  });

  // const handleViewDetails = (studentId: string) => {
  //   toast({
  //     title: "Visualizando detalhes do aluno",
  //     description: `Redirecionando para a página de detalhes do aluno #${studentId}`,
  //   });
  // };

  // const handleEdit = (studentId: string) => {
  //   toast({
  //     title: "Editando aluno",
  //     description: `Redirecionando para a página de edição do aluno #${studentId}`,
  //   });
  // };

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
    // handleViewDetails,
    // handleEdit,
    handleDelete
  };
}
