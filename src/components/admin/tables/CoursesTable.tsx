
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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { useCourses } from "@/hooks/admin/useCourses";

const CoursesTable: React.FC = () => {
  const { data: courses, isLoading, error } = useCourses();

  // const handleViewDetails = (courseId: string) => {
  //   toast({
  //     title: "Visualizando detalhes do curso",
  //     description: `Redirecionando para a página de detalhes do curso #${courseId}`,
  //   });
  // };

  const handleEdit = (courseId: string) => {
    toast({
      title: "Editando curso",
      description: `Redirecionando para a página de edição do curso #${courseId}`,
    });
  };

  const handleDelete = (courseId: string) => {
    toast({
      title: "Excluir curso",
      description: `Confirmação para excluir o curso #${courseId}`,
      variant: "destructive",
    });
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

  if (error) {
    return (
      <div className="border rounded-md p-4 bg-red-50">
        <h3 className="text-red-600 font-medium">Erro ao carregar cursos</h3>
        <p className="text-red-500">{error.message || "Ocorreu um erro desconhecido"}</p>
        <p className="text-sm text-gray-600 mt-2">
          Este erro pode estar relacionado à função SQL no Supabase. 
          Verifique o console para mais detalhes.
        </p>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        <p className="text-gray-500">Nenhum curso encontrado</p>
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
            <TableHead className="hidden lg:table-cell">Professor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Início</TableHead>
            <TableHead className="hidden md:table-cell">Alunos</TableHead>
            {/* <TableHead className="text-right">Ações</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course, index) => (
            <TableRow key={course.class_id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-start">{course.name}</p>
                  <p className="text-sm text-gray-500 hidden md:block text-start">{course.description}</p>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-start">{course.teacher_name}</TableCell>
              <TableCell className="text-start">
                <Badge
                  variant={course.is_active ? "default" : "secondary"}
                  className={
                    course.is_active
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }
                >
                  {course.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-start">
                {new Date(course.start_date).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="hidden md:table-cell text-start">{course.students_count}</TableCell>
              <TableCell className="text-right">
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CoursesTable;
