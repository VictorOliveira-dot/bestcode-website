
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, GraduationCap, Plus } from "lucide-react";

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
  const handleAddLessonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Dashboard card - Opening add lesson modal");
    onAddLessonClick();
  };

  const handleTabChange = (tab: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChangeTab(tab);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleTabChange("classes")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Turmas</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{classesCount}</div>
          <p className="text-xs text-muted-foreground">turmas ativas</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleTabChange("lessons")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aulas</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lessonsCount}</div>
          <p className="text-xs text-muted-foreground">aulas criadas</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleTabChange("students")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alunos</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{studentsCount}</div>
          <p className="text-xs text-muted-foreground">alunos matriculados</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nova Aula</CardTitle>
          <Plus className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Button 
            type="button"
            variant="secondary" 
            size="sm" 
            className="w-full"
            onClick={handleAddLessonClick}
          >
            Adicionar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
