
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
import { StudentDataEditModal } from "../modals/StudentDataEditModal";

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
  const [showDataEdit, setShowDataEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [details, setDetails] = useState(null);
  
  const { 
    fetchStudentDetails, 
    updateEnrollment, 
    deleteStudent 
  } = useStudentActions();

  const handleViewDetails = async () => {
    try {
      const details = await fetchStudentDetails(student.user_id);
      setDetails(details);
      setShowDetails(true);
      
      // Call parent handler if provided
      if (onViewDetails) {
        onViewDetails(student.user_id);
      }
    } catch (error) {
      
    }
  };

  const handleEdit = async () => {
    try {
      const details = await fetchStudentDetails(student.user_id);
      setDetails(details);
      setShowEdit(true);
      
      // Call parent handler if provided
      if (onEdit) {
        onEdit(student.user_id);
      }
    } catch (error) {
      
    }
  };

  const handleDataEdit = async () => {
    try {
      const details = await fetchStudentDetails(student.user_id);
      setDetails(details);
      setShowDataEdit(true);
    } catch (error) {
      
    }
  };

  const handleUpdateEnrollment = async (values: { classId: string; status: string }) => {
    await updateEnrollment({
      studentId: student.user_id,
      classId: values.classId,
      status: values.status
    });
  };

  const handleDelete = async () => {
    setShowDelete(true);
    
    // Call parent handler if provided
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
            <span>Editar Matrícula</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDataEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Editar Dados</span>
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
        details={details}
      />

      <StudentEditModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onConfirm={handleUpdateEnrollment}
        studentDetails={details}
      />

      <StudentDataEditModal
        isOpen={showDataEdit}
        onClose={() => setShowDataEdit(false)}
        studentDetails={details}
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
