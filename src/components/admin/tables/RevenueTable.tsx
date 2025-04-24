
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useRevenue } from "@/hooks/admin/useRevenue";

const RevenueTable: React.FC = () => {
  const [groupBy, setGroupBy] = useState<'all' | 'month' | 'class'>('month');
  const { data: revenueData, isLoading, error } = useRevenue({ groupBy });

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
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

  if (!revenueData || revenueData.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        <p className="text-gray-500">Nenhum dado de receita encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Relatório de Receita</h2>
        <Select value={groupBy} onValueChange={(value: 'all' | 'month' | 'class') => setGroupBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Agrupar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Total</SelectItem>
            <SelectItem value="month">Por Mês</SelectItem>
            <SelectItem value="class">Por Curso</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {groupBy === 'month' && <TableHead>Período</TableHead>}
              <TableHead>Curso</TableHead>
              <TableHead className="text-right">Total de Alunos</TableHead>
              <TableHead className="text-right">Receita</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {revenueData.map((item, index) => (
              <TableRow key={index}>
                {groupBy === 'month' && (
                  <TableCell>{formatDate(item.month_date)}</TableCell>
                )}
                <TableCell>{item.class_name}</TableCell>
                <TableCell className="text-right">{item.total_students}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(item.total_revenue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RevenueTable;
