
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useTeachers } from "@/hooks/admin/useTeachers";
import { supabase } from "@/integrations/supabase/client";

const TeachersTable: React.FC = () => {
  const navigate = useNavigate();
  const { teachers, isLoading, fetchTeachers } = useTeachers();

  const handleViewDetails = (teacherId: string) => {
    toast({
      title: "Visualizando detalhes",
      description: `Redirecionando para a página de detalhes do professor #${teacherId}`,
    });
    // In a real app, this would navigate to a teacher details page
    // navigate(`/admin/teachers/${teacherId}`);
  };

  const handleEdit = (teacherId: string) => {
    toast({
      title: "Editando professor",
      description: `Redirecionando para a página de edição do professor #${teacherId}`,
    });
    // In a real app, this would navigate to a teacher edit page
    // navigate(`/admin/teachers/${teacherId}/edit`);
  };

  const handleDelete = async (teacherId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', teacherId);

      if (error) throw error;

      toast({
        title: "Professor removido",
        description: "O professor foi removido com sucesso.",
      });
      
      // Refresh the teachers list
      fetchTeachers();
    } catch (error: any) {
      console.error("Error deleting teacher:", error);
      toast({
        title: "Erro ao remover professor",
        description: error.message || "Ocorreu um erro ao remover o professor.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Data de Cadastro</TableHead>
            <TableHead className="hidden md:table-cell">Turmas</TableHead>
            <TableHead className="hidden md:table-cell">Alunos</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher, index) => (
            <TableRow key={teacher.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{teacher.name}</TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(teacher.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="hidden md:table-cell">{teacher.classes_count}</TableCell>
              <TableCell className="hidden md:table-cell">{teacher.students_count}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem onClick={() => handleViewDetails(teacher.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Detalhes</span>
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ver perfil, turmas e avaliações do professor</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem onClick={() => handleEdit(teacher.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Atualizar dados e permissões do professor</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(teacher.id)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Desativar acesso do professor ao sistema</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeachersTable;
