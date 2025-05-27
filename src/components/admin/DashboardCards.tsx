
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UsersRound, GraduationCap, BookOpen, DollarSign } from "lucide-react";

interface DashboardCardsProps {
  studentsCount: number;
  teachersCount: number;
  coursesCount: number;
  revenueAmount: string;
  onChangeTab: (tab: string) => void;
}

const AdminDashboardCards: React.FC<DashboardCardsProps> = ({
  studentsCount,
  teachersCount,
  coursesCount,
  revenueAmount,
  onChangeTab,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow" 
        onClick={() => onChangeTab("students")}
      >
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Alunos</p>
            <h3 className="text-2xl font-bold mt-1">{studentsCount}</h3>
            <p className="text-xs text-gray-500 mt-1">Total de alunos matriculados</p>
          </div>
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <UsersRound className="h-6 w-6 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow" 
        onClick={() => onChangeTab("teachers")}
      >
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Professores</p>
            <h3 className="text-2xl font-bold mt-1">{teachersCount}</h3>
            <p className="text-xs text-gray-500 mt-1">Instrutores ativos</p>
          </div>
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow" 
        onClick={() => onChangeTab("courses")}
      >
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Turmas</p>
            <h3 className="text-2xl font-bold mt-1">{coursesCount}</h3>
            <p className="text-xs text-gray-500 mt-1">Turmas ativas</p>
          </div>
          <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow" 
        onClick={() => onChangeTab("payments")}
      >
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Receita</p>
            <h3 className="text-2xl font-bold mt-1">{revenueAmount}</h3>
            <p className="text-xs text-gray-500 mt-1">Receita total</p>
          </div>
          <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-yellow-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardCards;
