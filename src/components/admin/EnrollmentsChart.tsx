
import React from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface EnrollmentsChartProps {
  month: string;
  year: number;
}

const EnrollmentsChart: React.FC<EnrollmentsChartProps> = ({ month, year }) => {
  // Data mockado para demonstração
  const monthlyData = [
    { name: "Jan", matriculas: 45 },
    { name: "Fev", matriculas: 52 },
    { name: "Mar", matriculas: 48 },
    { name: "Abr", matriculas: 70 },
    { name: "Mai", matriculas: 65 },
    { name: "Jun", matriculas: 85 },
    { name: "Jul", matriculas: 78 },
    { name: "Ago", matriculas: 90 },
    { name: "Set", matriculas: 120 },
    { name: "Out", matriculas: 95 },
    { name: "Nov", matriculas: 110 },
    { name: "Dez", matriculas: 125 }
  ];
  
  // Filtrar dados com base no mês selecionado
  const filteredData = month === "all" 
    ? monthlyData 
    : monthlyData.filter(item => monthlyData.indexOf(item) + 1 === parseInt(month));

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
