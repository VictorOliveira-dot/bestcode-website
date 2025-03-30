
import React from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody
} from "@/components/ui/table";
import ClassItem, { ClassInfo } from "./ClassItem";

interface ClassTableProps {
  classes: ClassInfo[];
  openEditDialog: (classInfo: ClassInfo) => void;
  handleDeleteClass: (id: string) => void;
}

const ClassTable: React.FC<ClassTableProps> = ({ 
  classes, 
  openEditDialog, 
  handleDeleteClass 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Data de Início</TableHead>
          <TableHead>Alunos</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {classes.map((classInfo) => (
          <ClassItem 
            key={classInfo.id}
            classInfo={classInfo}
            onEdit={openEditDialog}
            onDelete={handleDeleteClass}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default ClassTable;
