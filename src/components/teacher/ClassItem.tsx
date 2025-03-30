
import React from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

export interface ClassInfo {
  id: string;
  name: string;
  description: string;
  startDate: string;
  studentsCount: number;
}

interface ClassItemProps {
  classInfo: ClassInfo;
  onEdit: (classInfo: ClassInfo) => void;
  onDelete: (id: string) => void;
}

const ClassItem: React.FC<ClassItemProps> = ({ classInfo, onEdit, onDelete }) => {
  return (
    <TableRow key={classInfo.id}>
      <TableCell className="font-medium">{classInfo.name}</TableCell>
      <TableCell>{classInfo.description}</TableCell>
      <TableCell>{new Date(classInfo.startDate).toLocaleDateString('pt-BR')}</TableCell>
      <TableCell>{classInfo.studentsCount} alunos</TableCell>
      <TableCell className="text-right space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(classInfo)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onDelete(classInfo.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ClassItem;
