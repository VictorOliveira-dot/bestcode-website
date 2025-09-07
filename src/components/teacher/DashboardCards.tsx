
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface DashboardCardsProps {
  classesCount: number;
  lessonsCount: number;
  studentsCount: number;
  onAddLessonClick: () => void;
  onChangeTab: (tab: string) => void;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({
  classesCount,
  lessonsCount,
  studentsCount,
  onAddLessonClick,
  onChangeTab
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Minhas Turmas</CardTitle>
          <CardDescription className="text-sm">Gerencie suas turmas ativas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-2xl sm:text-3xl font-bold text-primary">{classesCount} turmas</p>
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => onChangeTab("classes")}
          >
            Ver Turmas
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Alunos</CardTitle>
          <CardDescription className="text-sm">Total de alunos matriculados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-2xl sm:text-3xl font-bold text-primary">{studentsCount} alunos</p>
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => onChangeTab("all-students")}
          >
            Ver Alunos
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-200 sm:col-span-2 lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Aulas em Vídeo</CardTitle>
          <CardDescription className="text-sm">Gerenciar aulas gravadas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-2xl sm:text-3xl font-bold text-primary">{lessonsCount} aulas</p>
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={onAddLessonClick}
          >
            Adicionar Aula
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
