
import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import ClassItem from "./ClassItem";
import { Skeleton } from "@/components/ui/skeleton";
import MobileClassCard from "./MobileClassCard";
import { useClassTable, ClassTableProps } from "@/hooks/teacher/useClassTable";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ClassTable: React.FC<ClassTableProps> = (props) => {
  const { classes, isLoading, isMobile, isEmpty, error, refetch } = useClassTable(props);
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

  if (error) {
    return (
      <div className="text-center p-6 border rounded-md bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
        <p className="text-destructive-foreground font-medium">Erro ao carregar dados</p>
        <p className="text-sm text-muted-foreground mt-1">
          {error || "Ocorreu um erro ao carregar as turmas. Por favor, tente novamente."}
        </p>
        {refetch && (
          <Button 
            onClick={refetch} 
            variant="outline" 
            className="mt-4 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Button>
        )}
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

