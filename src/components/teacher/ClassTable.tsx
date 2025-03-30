
import React from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody
} from "@/components/ui/table";
import ClassItem, { ClassInfo } from "./ClassItem";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

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
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-4">
        {classes.map((classInfo) => (
          <Card key={classInfo.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">{classInfo.name}</h3>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditDialog(classInfo)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteClass(classInfo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{classInfo.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Data de início:</span>
                    <p>{new Date(classInfo.startDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="font-medium">Alunos:</span>
                    <p>{classInfo.studentsCount} alunos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
