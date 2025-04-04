
import React from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface EnrollmentsChartProps {
  month: string;
  year: number;
}

const EnrollmentsChart: React.FC<EnrollmentsChartProps> = ({ month, year }) => {
  // Sample data - in a real application, this would be fetched from your API
  // based on the selected month and year
  const data = [
    { name: "Jan", matriculas: 4 },
    { name: "Fev", matriculas: 6 },
    { name: "Mar", matriculas: 8 },
    { name: "Abr", matriculas: 5 },
    { name: "Mai", matriculas: 7 },
    { name: "Jun", matriculas: 9 },
    { name: "Jul", matriculas: 3 },
    { name: "Ago", matriculas: 6 },
    { name: "Set", matriculas: 8 },
    { name: "Out", matriculas: 10 },
    { name: "Nov", matriculas: 7 },
    { name: "Dez", matriculas: 5 }
  ];

  // Filter data based on selected month
  const filteredData = month === "all" 
    ? data 
    : data.filter(item => {
        const monthNumber = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
                            "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
                            .indexOf(item.name) + 1;
        return monthNumber.toString() === month;
      });

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
