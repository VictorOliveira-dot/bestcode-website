
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

interface Student {
  id: string;
  name: string;
  email: string;
  created_at: string;
  classes_count: number;
  last_active: string;
  progress_average: number;
}

// Mock student data
const MOCK_STUDENTS: Student[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@example.com",
    created_at: "2023-02-15T08:30:00Z",
    classes_count: 2,
    last_active: "2023-04-18T14:25:00Z",
    progress_average: 75
  },
  {
    id: "2",
    name: "Bruno Santos",
    email: "bruno.santos@example.com",
    created_at: "2023-03-10T10:15:00Z",
    classes_count: 3,
    last_active: "2023-04-20T09:45:00Z",
    progress_average: 92
  },
  {
    id: "3",
    name: "Carla Oliveira",
    email: "carla.oliveira@example.com",
    created_at: "2023-01-05T11:20:00Z",
    classes_count: 1,
    last_active: "2023-04-15T16:30:00Z",
    progress_average: 45
  }
];

const StudentsTable: React.FC = () => {
  const { user } = useAuth();
  const [isSessionChecked, setIsSessionChecked] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("Current user in StudentsTable:", user);
      console.log("User role:", user.role);
      setIsSessionChecked(true);
    }
  }, [user]);

  const { data: students, isLoading, error, refetch } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      try {
        console.log("Fetching students data...");
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log("Students data fetched successfully:", MOCK_STUDENTS.length);
        return MOCK_STUDENTS;
      } catch (err: any) {
        console.error("Failed to fetch students:", err);
        throw err;
      }
    },
    enabled: !!user?.id && user?.role === 'admin' && isSessionChecked
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 border border-red-300 rounded-md bg-red-50">
        <h3 className="text-lg font-medium mb-2">Erro ao carregar alunos</h3>
        <p>{(error as Error).message}</p>
        <Button 
          onClick={() => refetch()} 
          variant="secondary" 
          className="mt-4"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <p className="text-muted-foreground">Nenhum aluno encontrado no sistema.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Matrícula</TableHead>
            <TableHead>Turmas</TableHead>
            <TableHead className="hidden md:table-cell">Última Atividade</TableHead>
            <TableHead>Progresso</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(student.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>{student.classes_count}</TableCell>
              <TableCell className="hidden md:table-cell">
                {student.last_active ? new Date(student.last_active).toLocaleDateString('pt-BR') : 'Nunca'}
              </TableCell>
              <TableCell>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-bestcode-600 h-2.5 rounded-full"
                    style={{ width: `${student.progress_average}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{Math.round(student.progress_average)}%</span>
              </TableCell>
              <TableCell className="text-right">
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
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Detalhes</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Excluir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentsTable;
