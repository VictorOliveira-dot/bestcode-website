
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";

interface StudentActionsProps {
  studentId: string;
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function StudentActions({ studentId, onViewDetails, onEdit, onDelete }: StudentActionsProps) {
  return (
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem onClick={() => onViewDetails(studentId)}>
                <Eye className="mr-2 h-4 w-4" />
                <span>Detalhes</span>
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ver perfil completo e histórico do aluno</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem onClick={() => onEdit(studentId)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Atualizar informações cadastrais do aluno</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem onClick={() => onDelete(studentId)} className="text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remover aluno e todo seu histórico do sistema</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
