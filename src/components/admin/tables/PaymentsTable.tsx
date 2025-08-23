
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
import { MoreHorizontal, Eye, Receipt, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

const mockPayments = [
  {
    id: "1",
    student_name: "João Silva",
    student_email: "joao.silva@email.com",
    course: "QA Avançado",
    amount: "R$ 997,00",
    date: "15/03/2023",
    method: "credit_card",
    status: "completed"
  },
  {
    id: "2",
    student_name: "Maria Oliveira",
    student_email: "maria.oliveira@email.com",
    course: "QA Avançado",
    amount: "R$ 997,00",
    date: "20/03/2023",
    method: "credit_card",
    status: "completed"
  },
  {
    id: "3",
    student_name: "Pedro Santos",
    student_email: "pedro.santos@email.com",
    course: "Testes de API",
    amount: "R$ 597,00",
    date: "10/04/2023",
    method: "bank_transfer",
    status: "failed"
  },
  {
    id: "4",
    student_name: "Ana Costa",
    student_email: "ana.costa@email.com",
    course: "Automação com Cypress",
    amount: "R$ 797,00",
    date: "05/05/2023",
    method: "pix",
    status: "pending"
  },
  {
    id: "5",
    student_name: "Carlos Ferreira",
    student_email: "carlos.ferreira@email.com",
    course: "QA Avançado",
    amount: "R$ 997,00",
    date: "12/05/2023",
    method: "boleto",
    status: "completed"
  }
];

const AdminPaymentsTable: React.FC = () => {
  const handleViewDetails = (paymentId: string) => {
    // toast({
    //   title: "Visualizando detalhes do pagamento",
    //   description: `Redirecionando para a página de detalhes do pagamento #${paymentId}`,
    // });
    // In a real app, this would navigate to a payment details page
    // navigate(`/admin/payments/${paymentId}`);
  };

  const handleReceipt = (paymentId: string) => {
    toast({
      title: "Gerando recibo",
      description: `Gerando recibo do pagamento #${paymentId}`,
    });
    // In a real app, this would generate and download a receipt or open it in a new tab
  };

  const handleRetry = (paymentId: string) => {
    toast({
      title: "Tentando novamente o pagamento",
      description: `Iniciando tentativa de processamento do pagamento #${paymentId}`,
    });
    // In a real app, this would initiate a payment retry process
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Aluno</TableHead>
            <TableHead className="hidden md:table-cell">Curso</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead className="hidden md:table-cell">Data</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockPayments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.id}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{payment.student_name}</p>
                  <p className="text-sm text-gray-500 hidden md:block">{payment.student_email}</p>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{payment.course}</TableCell>
              <TableCell>{payment.amount}</TableCell>
              <TableCell className="hidden md:table-cell">{payment.date}</TableCell>
              <TableCell>
                {payment.method === "credit_card" && "Cartão de Crédito"}
                {payment.method === "bank_transfer" && "Transferência"}
                {payment.method === "pix" && "PIX"}
                {payment.method === "boleto" && "Boleto"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    payment.status === "completed"
                      ? "default"
                      : payment.status === "pending"
                      ? "outline"
                      : "destructive"
                  }
                  className={
                    payment.status === "completed"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : payment.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {payment.status === "completed"
                    ? "Concluído"
                    : payment.status === "pending"
                    ? "Pendente"
                    : "Falhou"}
                </Badge>
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem onClick={() => handleViewDetails(payment.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Detalhes</span>
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Visualizar detalhes completos da transação</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem onClick={() => handleReceipt(payment.id)}>
                            <Receipt className="mr-2 h-4 w-4" />
                            <span>Recibo</span>
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Baixar ou enviar recibo do pagamento por email</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {payment.status === "failed" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuItem onClick={() => handleRetry(payment.id)}>
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              <span>Tentar novamente</span>
                            </DropdownMenuItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Iniciar nova tentativa de processamento do pagamento</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
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

export default AdminPaymentsTable;
