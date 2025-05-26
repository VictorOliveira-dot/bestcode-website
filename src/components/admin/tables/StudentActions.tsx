
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { useStudentActions } from "@/hooks/admin/useStudentActions";
import { StudentDetailsModal } from "../modals/StudentDetailsModal";
import { StudentEditModal } from "../modals/StudentEditModal";
import { DeleteStudentDialog } from "../modals/DeleteStudentDialog";

export interface StudentActionsProps {
  student: {
    user_id: string;
    name: string;
  };
  onViewDetails?: (studentId: string) => void;
  onEdit?: (studentId: string) => void;
  onDelete?: (studentId: string) => void;
}

export function StudentActions({ student, onViewDetails, onEdit, onDelete }: StudentActionsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  
  const { updateEnrollment, deleteStudent } = useStudentActions();

  const handleViewDetails = () => {
    setShowDetails(true);
    if (onViewDetails) {
      onViewDetails(student.user_id);
    }
  };

  const handleEdit = () => {
    setShowEdit(true);
    if (onEdit) {
      onEdit(student.user_id);
    }
  };

  const handleUpdateEnrollment = async (values: { classId: string; status: string }) => {
    await updateEnrollment({
      studentId: student.user_id,
      classId: values.classId,
      status: values.status
    });
  };

  const handleDelete = () => {
    setShowDelete(true);
    if (onDelete) {
      onDelete(student.user_id);
    }
  };

  const handleConfirmDelete = async () => {
    await deleteStudent(student.user_id);
    setShowDelete(false);
  };

  return (
    <>
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
          <DropdownMenuItem onClick={handleViewDetails}>
            <Eye className="mr-2 h-4 w-4" />
            <span>Detalhes</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Editar</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDelete}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Excluir</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <StudentDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        studentId={showDetails ? student.user_id : null}
      />

      <StudentEditModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onConfirm={handleUpdateEnrollment}
        studentId={showEdit ? student.user_id : null}
      />

      <DeleteStudentDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleConfirmDelete}
        studentName={student.name}
      />
    </>
  );
}
