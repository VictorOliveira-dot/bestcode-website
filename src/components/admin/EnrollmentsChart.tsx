
import React from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEnrollmentStats } from "@/hooks/admin/useEnrollmentStats";
import { Skeleton } from "@/components/ui/skeleton";

interface EnrollmentsChartProps {
  month: string;
  year: number;
}

const EnrollmentsChart: React.FC<EnrollmentsChartProps> = ({ month, year }) => {
  const { enrollmentStats, isLoading } = useEnrollmentStats();

  if (isLoading) {
    return (
      <Card className="p-4">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-80 w-full" />
      </Card>
    );
  }

  // Filtrar dados com base no mês e ano selecionados
  let filteredData = enrollmentStats;
  
  if (month !== "all") {
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const selectedMonth = monthNames[parseInt(month) - 1];
    filteredData = enrollmentStats.filter(item => 
      item.month === selectedMonth && item.year === year
    );
  } else {
    // Mostrar todos os dados do ano selecionado
    filteredData = enrollmentStats.filter(item => item.year === year);
  }

  // Transformar dados para o formato do gráfico
  const chartData = filteredData.map(item => ({
    name: item.month,
    matriculas: item.count
  }));

  return (
    <Card className="p-4">
      <h3 className="font-medium text-lg mb-4">
        Matrículas {month !== "all" ? `em ${chartData[0]?.name || 'Mês Selecionado'}` : ""} de {year}
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="matriculas" name="Matrículas" fill="#4c1d95" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {chartData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum dado disponível para o período selecionado</p>
        </div>
      )}
    </Card>
  );
};

export default EnrollmentsChart;
