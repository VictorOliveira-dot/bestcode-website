
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

const mockStudents = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    enrollment_date: "15/03/2023",
    course: "QA Avançado",
    status: "active",
    payment_status: "paid",
    progress: 65
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    phone: "(11) 91234-5678",
    enrollment_date: "20/03/2023",
    course: "QA Avançado",
    status: "active",
    payment_status: "paid",
    progress: 42
  },
  {
    id: "3",
    name: "Pedro Santos",
    email: "pedro.santos@email.com",
    phone: "(21) 99876-5432",
    enrollment_date: "10/04/2023",
    course: "Testes de API",
    status: "inactive",
    payment_status: "overdue",
    progress: 0
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(11) 97777-8888",
    enrollment_date: "05/05/2023",
    course: "Automação com Cypress",
    status: "active",
    payment_status: "pending",
    progress: 28
  },
  {
    id: "5",
    name: "Carlos Ferreira",
    email: "carlos.ferreira@email.com",
    phone: "(13) 96666-7777",
    enrollment_date: "12/05/2023",
    course: "QA Avançado",
    status: "active",
    payment_status: "paid",
    progress: 78
  }
];

const AdminStudentsTable: React.FC = () => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Curso</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Progresso</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.id}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell className="hidden md:table-cell">{student.phone}</TableCell>
              <TableCell className="hidden lg:table-cell">{student.course}</TableCell>
              <TableCell>
                <Badge
                  variant={student.status === "active" ? "default" : "secondary"}
                  className={
                    student.status === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }
                >
                  {student.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    student.payment_status === "paid"
                      ? "default"
                      : student.payment_status === "pending"
                      ? "outline"
                      : "destructive"
                  }
                  className={
                    student.payment_status === "paid"
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      : student.payment_status === "pending"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {student.payment_status === "paid"
                    ? "Pago"
                    : student.payment_status === "pending"
                    ? "Pendente"
                    : "Atrasado"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-bestcode-600 h-2.5 rounded-full"
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{student.progress}%</span>
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

export default AdminStudentsTable;
