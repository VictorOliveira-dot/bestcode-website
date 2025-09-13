
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      <Card 
        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105" 
        onClick={() => onChangeTab("students")}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Alunos</p>
              <h3 className="text-2xl sm:text-3xl font-bold">{studentsCount}</h3>
              <p className="text-xs text-muted-foreground">Total matriculados</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
              <UsersRound className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105" 
        onClick={() => onChangeTab("teachers")}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Professores</p>
              <h3 className="text-2xl sm:text-3xl font-bold">{teachersCount}</h3>
              <p className="text-xs text-muted-foreground">Instrutores ativos</p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105" 
        onClick={() => onChangeTab("courses")}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Turmas</p>
              <h3 className="text-2xl sm:text-3xl font-bold">{coursesCount}</h3>
              <p className="text-xs text-muted-foreground">Turmas ativas</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105" 
        onClick={() => onChangeTab("reports")}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Relatórios</p>
              <h3 className="text-xl sm:text-2xl font-bold">{studentsCount}</h3>
              <p className="text-xs text-muted-foreground">Total de matriculados</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardCards;
