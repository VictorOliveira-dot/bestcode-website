
import React from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody
} from "@/components/ui/table";
import ClassItem from "./ClassItem";
import { ClassInfo } from "./ClassItem";
import { Skeleton } from "@/components/ui/skeleton";
import MobileClassCard from "./MobileClassCard";
import { useClassTable, ClassTableProps } from "@/hooks/teacher/useClassTable";

const ClassTable: React.FC<ClassTableProps> = (props) => {
  const { classes, isLoading, isMobile, isEmpty } = useClassTable(props);
  const { openEditDialog, handleDeleteClass } = props;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center p-4 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">Nenhuma turma encontrada</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {classes.map((classInfo) => (
          <MobileClassCard
            key={classInfo.id}
            classInfo={classInfo}
            onEdit={openEditDialog}
            onDelete={handleDeleteClass}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
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
    </div>
  );
};

export default ClassTable;
