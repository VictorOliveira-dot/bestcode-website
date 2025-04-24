
import React from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAdminData } from "@/hooks/admin/useAdminData";

interface EnrollmentsChartProps {
  month: string;
  year: number;
}

const EnrollmentsChart: React.FC<EnrollmentsChartProps> = ({ month, year }) => {
  const { enrollmentStats } = useAdminData();
  
  // Transformar os dados para o formato esperado pelo gráfico
  const processData = () => {
    if (!enrollmentStats || enrollmentStats.length === 0) {
      return [];
    }

    // Mapear os meses para nomes abreviados
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    
    // Formatar os dados
    return enrollmentStats.map(item => {
      const date = new Date(item.enrollment_date);
      return {
        name: monthNames[date.getMonth()],
        matriculas: item.total_enrollments,
        monthNumber: date.getMonth() + 1,
        fullDate: item.enrollment_date
      };
    });
  };

  const chartData = processData();
  
  // Filtrar dados com base no mês selecionado
  const filteredData = month === "all" 
    ? chartData 
    : chartData.filter(item => item.monthNumber.toString() === month);

  return (
    <Card className="p-4">
      <h3 className="font-medium text-lg mb-4">
        Matrículas {month !== "all" ? `em ${filteredData[0]?.name}` : ""} de {year}
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
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
    </Card>
  );
};

export default EnrollmentsChart;
