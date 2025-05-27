
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, User } from "lucide-react";
import { useTeacherData } from "@/hooks/teacher/useTeacherData";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

const AllClassesView = () => {
  const { classes, isLoading, error } = useTeacherData();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((_, index) => (
            <Skeleton key={index} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 border rounded-md bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive mx-auto mb-2" />
        <p className="text-destructive-foreground font-medium">Erro ao carregar turmas</p>
        <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Todas as Turmas ({classes.length})</h2>
      </div>
      
      <Input
        placeholder="Buscar por nome da turma, descrição ou professor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((classInfo) => (
          <Card key={classInfo.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{classInfo.name}</CardTitle>
                <Badge variant="secondary" className="ml-2">
                  Ativa
                </Badge>
              </div>
              <CardDescription className="line-clamp-3">
                {classInfo.description || "Sem descrição disponível"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Professor: {classInfo.teacher_name}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Início: {new Date(classInfo.startDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && classes.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma turma encontrada com os critérios de busca.</p>
        </div>
      )}

      {classes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma turma cadastrada no sistema.</p>
        </div>
      )}
    </div>
  );
};

export default AllClassesView;
