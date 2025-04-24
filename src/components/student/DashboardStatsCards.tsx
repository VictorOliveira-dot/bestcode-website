
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface DashboardStatsCardsProps {
  inProgressLessons: number;
  overallProgress: number;
  completedLessons: number;
  availableLessons: number;
  enrollmentsCount: number;
}

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({
  inProgressLessons,
  overallProgress,
  completedLessons,
  availableLessons,
  enrollmentsCount
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Meus Cursos</CardTitle>
          <CardDescription>Cursos em andamento</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{enrollmentsCount} cursos</p>
          <Link to="/student/courses">
            <Button className="mt-4 w-full bg-bestcode-600 hover:bg-bestcode-700 flex items-center justify-center gap-1">
              Ver Cursos
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Próximas Aulas</CardTitle>
          <CardDescription>Aulas agendadas</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{inProgressLessons} em andamento</p>
          <Link to="/student/schedule">
            <Button className="mt-4 w-full bg-bestcode-600 hover:bg-bestcode-700 flex items-center justify-center gap-1">
              Ver Agenda
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progresso</CardTitle>
          <CardDescription>Seu progresso geral</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{overallProgress}% completo</p>
          <p className="text-sm text-gray-600 mb-2">
            {completedLessons} de {availableLessons} aulas concluídas
          </p>
          <Link to="/student/progress">
            <Button className="mt-2 w-full bg-bestcode-600 hover:bg-bestcode-700 flex items-center justify-center gap-1">
              Ver Detalhes
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStatsCards;
