
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

const mockCourses = [
  {
    id: "1",
    title: "QA Avançado",
    description: "Curso completo de QA com técnicas avançadas",
    category: "QA",
    status: "active",
    price: "R$ 997,00",
    duration: "60 horas",
    students_count: 42,
    rating: 4.8
  },
  {
    id: "2",
    title: "Testes de API",
    description: "Aprenda testes de API do básico ao avançado",
    category: "QA",
    status: "active",
    price: "R$ 597,00",
    duration: "40 horas",
    students_count: 38,
    rating: 4.7
  },
  {
    id: "3",
    title: "Automação com Cypress",
    description: "Automação de testes web com Cypress",
    category: "Automação",
    status: "active",
    price: "R$ 797,00",
    duration: "50 horas",
    students_count: 35,
    rating: 4.9
  },
  {
    id: "4",
    title: "Testes Mobile",
    description: "Aprenda a testar aplicações mobile",
    category: "Mobile",
    status: "draft",
    price: "R$ 897,00",
    duration: "45 horas",
    students_count: 0,
    rating: 0
  },
  {
    id: "5",
    title: "Testes de Performance",
    description: "Testes de carga e performance para aplicações web",
    category: "Performance",
    status: "active",
    price: "R$ 1.197,00",
    duration: "55 horas",
    students_count: 28,
    rating: 4.6
  }
];

const AdminCoursesTable: React.FC = () => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Título</TableHead>
            <TableHead className="hidden lg:table-cell">Categoria</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead className="hidden md:table-cell">Duração</TableHead>
            <TableHead className="hidden md:table-cell">Alunos</TableHead>
            <TableHead className="hidden md:table-cell">Avaliação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockCourses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{course.id}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{course.title}</p>
                  <p className="text-sm text-gray-500 hidden md:block">{course.description}</p>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">{course.category}</TableCell>
              <TableCell>
                <Badge
                  variant={course.status === "active" ? "default" : "secondary"}
                  className={
                    course.status === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }
                >
                  {course.status === "active" ? "Ativo" : "Rascunho"}
                </Badge>
              </TableCell>
              <TableCell>{course.price}</TableCell>
              <TableCell className="hidden md:table-cell">{course.duration}</TableCell>
              <TableCell className="hidden md:table-cell">{course.students_count}</TableCell>
              <TableCell className="hidden md:table-cell">
                {course.rating > 0 ? (
                  <div className="flex items-center">
                    {course.rating}
                    <span className="text-yellow-500 ml-1">★</span>
                  </div>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
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

export default AdminCoursesTable;
