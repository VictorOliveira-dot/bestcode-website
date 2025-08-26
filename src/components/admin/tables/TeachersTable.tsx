
import React, { useState } from "react";
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
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TeacherDetailsModal } from "../modals/TeacherDetailsModal";
import { TeacherEditModal } from "../modals/TeacherEditModal";
import { DeleteTeacherDialog } from "../modals/DeleteTeacherDialog";
import { toast } from "@/hooks/use-toast";
import { useTeachers } from "@/hooks/admin/useTeachers";
import { supabase } from "@/integrations/supabase/client";

const TeachersTable: React.FC = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { teachers, isLoading, fetchTeachers } = useTeachers();

  const handleViewDetails = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    setSelectedTeacher(teacher);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const handleEditConfirm = async (values: { name: string; email: string }) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: values.name,
          email: values.email,
        })
        .eq('id', selectedTeacher.id);

      if (error) throw error;

      toast({
        title: "Professor atualizado",
        description: "As informações foram atualizadas com sucesso.",
      });

      fetchTeachers();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar professor",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    setSelectedTeacher(teacher);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', selectedTeacher.id);

      if (error) throw error;

      toast({
        title: "Professor removido",
        description: "O professor foi removido com sucesso.",
      });

      setIsDeleteDialogOpen(false);
      fetchTeachers();
    } catch (error: any) {
      toast({
        title: "Erro ao remover professor",
        description: error.message,
        variant: "destructive",
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
    <>
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
              <TableHead className="text-start">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher, index) => (
              <TableRow key={teacher.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="text-start">{teacher.name}</TableCell>
                <TableCell className="text-start">{teacher.email}</TableCell>
                <TableCell className="hidden md:table-cell text-start">
                  {new Date(teacher.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="hidden md:table-cell text-start">{teacher.classes_count}</TableCell>
                <TableCell className="hidden md:table-cell text-start">{teacher.students_count}</TableCell>
                <TableCell className="text-start">
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
                      <DropdownMenuItem onClick={() => handleViewDetails(teacher.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Detalhes</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(teacher.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(teacher.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
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

      <TeacherDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        details={selectedTeacher}
      />

      <TeacherEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditConfirm}
        teacherDetails={selectedTeacher}
      />

      <DeleteTeacherDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        teacherName={selectedTeacher?.name || ""}
      />
    </>
  );
};

export default TeachersTable;
