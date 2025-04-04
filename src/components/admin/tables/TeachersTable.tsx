
import React from "react";
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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";

const mockTeachers = [
  {
    id: "1",
    name: "Ana Paula Silva",
    email: "ana.silva@bestcode.com",
    phone: "(11) 98765-4321",
    speciality: "Automação de Testes",
    start_date: "10/01/2022",
    status: "active",
    students_count: 42,
    courses_count: 3
  },
  {
    id: "2",
    name: "Carlos Mendes",
    email: "carlos.mendes@bestcode.com",
    phone: "(11) 91234-5678",
    speciality: "Testes de API",
    start_date: "15/03/2022",
    status: "active",
    students_count: 38,
    courses_count: 2
  },
  {
    id: "3",
    name: "Luciana Ferreira",
    email: "luciana.ferreira@bestcode.com",
    phone: "(21) 99876-5432",
    speciality: "Testes de Performance",
    start_date: "05/05/2022",
    status: "inactive",
    students_count: 0,
    courses_count: 1
  },
  {
    id: "4",
    name: "Roberto Santos",
    email: "roberto.santos@bestcode.com",
    phone: "(11) 97777-8888",
    speciality: "Testes Mobile",
    start_date: "20/07/2022",
    status: "active",
    students_count: 28,
    courses_count: 2
  },
  {
    id: "5",
    name: "Fernanda Lima",
    email: "fernanda.lima@bestcode.com",
    phone: "(13) 96666-7777",
    speciality: "Testes de Usabilidade",
    start_date: "12/09/2022",
    status: "active",
    students_count: 35,
    courses_count: 2
  }
];

const AdminTeachersTable: React.FC = () => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Telefone</TableHead>
            <TableHead className="hidden lg:table-cell">Especialidade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Alunos</TableHead>
            <TableHead className="hidden md:table-cell">Cursos</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockTeachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell className="font-medium">{teacher.id}</TableCell>
              <TableCell>{teacher.name}</TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell className="hidden md:table-cell">{teacher.phone}</TableCell>
              <TableCell className="hidden lg:table-cell">{teacher.speciality}</TableCell>
              <TableCell>
                <Badge
                  variant={teacher.status === "active" ? "default" : "secondary"}
                  className={
                    teacher.status === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }
                >
                  {teacher.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{teacher.students_count}</TableCell>
              <TableCell className="hidden md:table-cell">{teacher.courses_count}</TableCell>
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

export default AdminTeachersTable;
