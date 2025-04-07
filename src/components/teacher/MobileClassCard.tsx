
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { ClassInfo } from "./ClassItem";

interface MobileClassCardProps {
  classInfo: ClassInfo;
  onEdit: (classInfo: ClassInfo) => void;
  onDelete: (id: string) => void;
}

const MobileClassCard: React.FC<MobileClassCardProps> = ({ 
  classInfo, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Card key={classInfo.id} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">{classInfo.name}</h3>
            <div className="flex space-x-2">
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
  );
};

export default MobileClassCard;
