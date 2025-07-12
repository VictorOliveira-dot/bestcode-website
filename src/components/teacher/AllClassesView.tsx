
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, User, Plus, Search } from "lucide-react";
import { useTeacherData } from "@/hooks/teacher/useTeacherData";
import { useClassManagement } from "@/hooks/teacher/useClassManagement";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddClassDialog from "./AddClassDialog";
import { toast } from "@/hooks/use-toast";

const AllClassesView = () => {
  const { classes, isLoading, error, refetchClasses } = useTeacherData();
  const { handleAddClass, isLoading: isLoadingManagement } = useClassManagement();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0], // Data padrão de hoje
  });

  // Memoizar a filtragem para melhor performance
  const filteredClasses = useMemo(() => {
    if (!searchTerm) return classes;
    
    const term = searchTerm.toLowerCase();
    return classes.filter(cls => 
      cls.name.toLowerCase().includes(term) ||
      cls.description?.toLowerCase().includes(term) ||
      cls.teacher_name?.toLowerCase().includes(term)
    );
  }, [classes, searchTerm]);

  const onAddClass = async () => {
    if (!newClass.name.trim() || !newClass.description.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e descrição da turma",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = await handleAddClass(newClass);
      if (success) {
        setNewClass({ 
          name: '', 
          description: '', 
          startDate: new Date().toISOString().split('T')[0]
        });
        setIsAddClassOpen(false);
        
        // Recarregar dados
        await refetchClasses();
        
        toast({
          title: "Sucesso",
          description: "Turma criada com sucesso",
        });
      }
    } catch (error: any) {
      console.error("Error adding class:", error);
      toast({
        title: "Erro",
        description: error?.message || "Ocorreu um erro ao criar a turma",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-96" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
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
        <Button 
          onClick={() => refetchClasses()} 
          variant="outline" 
          className="mt-3"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center sm:text-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Todas as Turmas</h2>
          <p className="text-muted-foreground">
            {classes.length} turma{classes.length !== 1 ? 's' : ''} no sistema
          </p>
        </div>
        <Button 
          onClick={() => setIsAddClassOpen(true)} 
          className="flex items-center gap-2"
          disabled={isLoadingManagement}
        >
          <Plus className="h-4 w-4" />
          {isLoadingManagement ? "Criando..." : "Nova Turma"}
        </Button>
      </div>
      
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, descrição ou professor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhuma turma cadastrada</h3>
          <p className="text-muted-foreground mb-4">
            Seja o primeiro a criar uma turma no sistema
          </p>
          <Button onClick={() => setIsAddClassOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar primeira turma
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.map((classInfo) => (
              <Card key={classInfo.id} className="hover:shadow-md transition-all duration-200 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-2 flex-1">{classInfo.name}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      Ativa
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-3">
                    {classInfo.description || "Sem descrição disponível"}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4 shrink-0" />
                    <span className="truncate">Professor: {classInfo.teacher_name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>
                      Início: {new Date(classInfo.startDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 shrink-0" />
                    <span>Alunos: {classInfo.studentsCount}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredClasses.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <Search className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma turma encontrada</h3>
              <p className="text-muted-foreground">
                Nenhuma turma corresponde aos critérios "{searchTerm}"
              </p>
            </div>
          )}
        </>
      )}

      <AddClassDialog
        isOpen={isAddClassOpen}
        onOpenChange={setIsAddClassOpen}
        newClass={newClass}
        setNewClass={setNewClass}
        handleAddClass={onAddClass}
        isLoading={isLoadingManagement}
      />
      </Card>
    </div>
  );
};

export default AllClassesView;
