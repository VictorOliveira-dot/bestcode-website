
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Minhas Turmas</CardTitle>
          <CardDescription>Gerencie suas turmas ativas</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{classesCount} turmas</p>
          <Button 
            className="mt-4 w-full bg-bestcode-600 hover:bg-bestcode-700"
            onClick={() => onChangeTab("classes")}
          >
            Ver Turmas
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alunos</CardTitle>
          <CardDescription>Total de alunos matriculados</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{studentsCount} alunos</p>
          <Button 
            className="mt-4 w-full bg-bestcode-600 hover:bg-bestcode-700"
            onClick={() => onChangeTab("students")}
          >
            Ver Alunos
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aulas em Vídeo</CardTitle>
          <CardDescription>Gerenciar aulas gravadas</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{lessonsCount} aulas</p>
          <Button 
            className="mt-4 w-full bg-bestcode-600 hover:bg-bestcode-700"
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
