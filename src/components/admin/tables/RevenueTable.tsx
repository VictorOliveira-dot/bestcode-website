
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useStripeRevenue } from "@/hooks/admin/useStripeRevenue";

const RevenueTable: React.FC = () => {
  const [groupBy, setGroupBy] = useState<'all' | 'month' | 'method'>('month');
  const { data: revenueData, totalRevenue, isLoading, error } = useStripeRevenue();

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border rounded-md p-4 bg-red-50">
        <h3 className="text-red-600 font-medium">Erro ao carregar dados de receita</h3>
        <p className="text-red-500">{error.message || "Ocorreu um erro desconhecido"}</p>
      </div>
    );
  }

  // Processar dados com base no agrupamento
  let processedData: any[] = [];

  if (groupBy === 'month') {
    const monthlyData = revenueData.reduce((acc: any, payment) => {
      const monthKey = formatDate(payment.payment_date);
      if (!acc[monthKey]) {
        acc[monthKey] = {
          period: monthKey,
          totalRevenue: 0,
          count: 0
        };
      }
      acc[monthKey].totalRevenue += payment.payment_amount || 0;
      acc[monthKey].count += 1;
      return acc;
    }, {});
    
    processedData = Object.values(monthlyData);
  } else if (groupBy === 'method') {
    const methodData = revenueData.reduce((acc: any, payment) => {
      const method = payment.payment_method || 'Não especificado';
      if (!acc[method]) {
        acc[method] = {
          method: method,
          totalRevenue: 0,
          count: 0
        };
      }
      acc[method].totalRevenue += payment.payment_amount || 0;
      acc[method].count += 1;
      return acc;
    }, {});
    
    processedData = Object.values(methodData);
  } else {
    // Total
    processedData = [{
      summary: 'Total Geral',
      totalRevenue: totalRevenue,
      count: revenueData.length
    }];
  }

  if (processedData.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Relatório de Receita (Stripe)</h2>
          <Select value={groupBy} onValueChange={(value: 'all' | 'month' | 'method') => setGroupBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Agrupar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Total</SelectItem>
              <SelectItem value="month">Por Mês</SelectItem>
              <SelectItem value="method">Por Método</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="border rounded-md p-8 text-center">
          <p className="text-gray-500">Nenhum pagamento encontrado no Stripe</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Relatório de Receita (Stripe)</h2>
        <Select value={groupBy} onValueChange={(value: 'all' | 'month' | 'method') => setGroupBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Agrupar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Total</SelectItem>
            <SelectItem value="month">Por Mês</SelectItem>
            <SelectItem value="method">Por Método</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {groupBy === 'month' && <TableHead>Período</TableHead>}
              {groupBy === 'method' && <TableHead>Método de Pagamento</TableHead>}
              {groupBy === 'all' && <TableHead>Resumo</TableHead>}
              <TableHead className="text-right">Quantidade</TableHead>
              <TableHead className="text-right">Receita</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  {item.period || item.method || item.summary}
                </TableCell>
                <TableCell className="text-right">{item.count}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(item.totalRevenue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <p className="text-blue-800 font-medium">
          Receita Total: {formatCurrency(totalRevenue)} ({revenueData.length} pagamentos)
        </p>
      </div>
    </div>
  );
};

export default RevenueTable;
