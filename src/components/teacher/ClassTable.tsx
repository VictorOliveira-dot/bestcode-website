
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
      <div className="space-y-2">
        {[1, 2].map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 border rounded-md bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive mx-auto mb-2" />
        <p className="text-destructive-foreground font-medium">Erro ao carregar turmas</p>
        <p className="text-sm text-muted-foreground mt-1">{error}</p>
        {refetch && (
          <Button 
            onClick={refetch} 
            variant="outline" 
            size="sm"
            className="mt-3"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center p-6 border rounded-md bg-muted/10">
        <p className="text-muted-foreground">Você ainda não possui turmas cadastradas</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
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
    <div className="rounded-md border">
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
