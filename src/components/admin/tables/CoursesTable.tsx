
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Class {
  id: string;
  name: string;
  description: string;
  start_date: string;
  teacher_name: string;
  students_count: number;
  is_active: boolean;
}

interface TeacherData {
  name: string;
}

const CoursesTable: React.FC = () => {
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data: classes, error } = await supabase
        .from('classes')
        .select(`
          id,
          name,
          description,
          start_date,
          is_active,
          teacher:users!classes_teacher_id_fkey(name),
          students:enrollments(student_id)
        `);

      if (error) throw error;

      return classes.map(c => ({
        ...c,
        teacher_name: c.teacher ? (c.teacher as TeacherData).name || 'Sem professor' : 'Sem professor',
        students_count: c.students ? (c.students as any[]).length || 0 : 0
      })) as Class[];
    }
  });

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
    return <div className="text-red-500">Error loading courses: {error.message}</div>;
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
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses?.map((course, index) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{course.name}</p>
                  <p className="text-sm text-gray-500 hidden md:block">{course.description}</p>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">{course.teacher_name}</TableCell>
              <TableCell>
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
              <TableCell className="hidden md:table-cell">
                {new Date(course.start_date).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="hidden md:table-cell">{course.students_count}</TableCell>
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
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Detalhes</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Excluir</span>
                    </DropdownMenuItem>
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

export default CoursesTable;
