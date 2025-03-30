
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Calendar, Users, Video, BookOpen } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Tipos para os vídeos/aulas
interface Lesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  date: string;
  class: string;
  visibility: 'all' | 'class_only';
}

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const savedLessons = localStorage.getItem('teacher_lessons');
    return savedLessons ? JSON.parse(savedLessons) : [
      {
        id: '1',
        title: 'Introdução ao Teste de API',
        description: 'Aula básica sobre testes de API e suas ferramentas',
        youtubeUrl: 'https://youtube.com/watch?v=example1',
        date: '2023-07-15',
        class: 'QA-01',
        visibility: 'class_only'
      },
      {
        id: '2',
        title: 'Testes de Regressão',
        description: 'Métodos avançados de testes de regressão',
        youtubeUrl: 'https://youtube.com/watch?v=example2',
        date: '2023-07-14',
        class: 'QA-02',
        visibility: 'all'
      },
      {
        id: '3',
        title: 'Automação com Cypress',
        description: 'Como utilizar o Cypress para automação de testes',
        youtubeUrl: 'https://youtube.com/watch?v=example3',
        date: '2023-07-13',
        class: 'QA-01',
        visibility: 'class_only'
      }
    ];
  });

  // Formulário da nova aula
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    date: '',
    class: 'QA-01',
    visibility: 'class_only' as 'all' | 'class_only'
  });

  // Classes disponíveis (poderiam vir de um banco de dados no futuro)
  const availableClasses = ['QA-01', 'QA-02', 'DEV-01', 'DEV-02'];

  // Função para validar URL do YouTube
  const isValidYoutubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(url);
  };

  // Redirect if not authenticated or not a teacher
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'teacher') {
    return <Navigate to="/student/dashboard" />;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso."
    });
  };

  const handleAddLesson = () => {
    if (!newLesson.title || !newLesson.youtubeUrl || !newLesson.date) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (!isValidYoutubeUrl(newLesson.youtubeUrl)) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida do YouTube.",
        variant: "destructive"
      });
      return;
    }

    const newLessonWithId = {
      ...newLesson,
      id: Date.now().toString()
    };

    const updatedLessons = [...lessons, newLessonWithId];
    setLessons(updatedLessons);
    
    // Salvar no localStorage
    localStorage.setItem('teacher_lessons', JSON.stringify(updatedLessons));
    
    // Limpar formulário e fechar modal
    setNewLesson({
      title: '',
      description: '',
      youtubeUrl: '',
      date: '',
      class: 'QA-01',
      visibility: 'class_only' as 'all' | 'class_only'
    });
    setIsAddLessonOpen(false);
    
    toast({
      title: "Aula adicionada",
      description: "Aula foi adicionada com sucesso."
    });
  };

  const handleDeleteLesson = (id: string) => {
    const updatedLessons = lessons.filter(lesson => lesson.id !== id);
    setLessons(updatedLessons);
    localStorage.setItem('teacher_lessons', JSON.stringify(updatedLessons));
    
    toast({
      title: "Aula removida",
      description: "Aula foi removida com sucesso."
    });
  };

  // Ordenar aulas por data (mais recente primeiro)
  const sortedLessons = [...lessons].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Agrupar aulas por turma
  const lessonsByClass = availableClasses.map(className => ({
    className,
    lessons: sortedLessons.filter(lesson => 
      lesson.class === className || lesson.visibility === 'all'
    )
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow py-4">
        <div className="container-custom flex justify-between items-center">
          <h1 className="text-2xl font-bold text-bestcode-800">Painel do Professor</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Olá, {user.name}</span>
            <Button variant="outline" onClick={handleLogout}>Sair</Button>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Minhas Turmas</CardTitle>
              <CardDescription>Gerencie suas turmas ativas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{availableClasses.length} turmas</p>
              <Button className="mt-4 w-full bg-bestcode-600 hover:bg-bestcode-700">Ver Turmas</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alunos</CardTitle>
              <CardDescription>Total de alunos matriculados</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">28 alunos</p>
              <Button className="mt-4 w-full bg-bestcode-600 hover:bg-bestcode-700">Ver Alunos</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aulas em Vídeo</CardTitle>
              <CardDescription>Gerenciar aulas gravadas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{lessons.length} aulas</p>
              <Button 
                className="mt-4 w-full bg-bestcode-600 hover:bg-bestcode-700"
                onClick={() => setIsAddLessonOpen(true)}
              >
                Adicionar Aula
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Painel de Aulas</CardTitle>
                <CardDescription>Gerenciamento de aulas e conteúdos</CardDescription>
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setIsAddLessonOpen(true)}
              >
                <Video className="h-4 w-4" />
                Nova Aula
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">Todas as Aulas</TabsTrigger>
                  {availableClasses.map(className => (
                    <TabsTrigger key={className} value={className}>{className}</TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value="all">
                  <div className="space-y-4">
                    {sortedLessons.length > 0 ? (
                      sortedLessons.map(lesson => (
                        <div key={lesson.id} className="p-4 border rounded-lg flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4 text-bestcode-600" />
                              <h3 className="font-semibold">{lesson.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                            <div className="flex gap-3 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(lesson.date).toLocaleDateString('pt-BR')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                Turma: {lesson.class}
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {lesson.visibility === 'all' ? 'Visível para todos' : 'Apenas para a turma'}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(lesson.youtubeUrl, '_blank')}
                            >
                              Ver
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteLesson(lesson.id)}
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Nenhuma aula cadastrada. Adicione sua primeira aula!
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {availableClasses.map(className => (
                  <TabsContent key={className} value={className}>
                    <div className="space-y-4">
                      {lessonsByClass
                        .find(c => c.className === className)?.lessons.length ? (
                        lessonsByClass
                          .find(c => c.className === className)
                          ?.lessons.map(lesson => (
                            <div key={lesson.id} className="p-4 border rounded-lg flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Video className="h-4 w-4 text-bestcode-600" />
                                  <h3 className="font-semibold">{lesson.title}</h3>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                                <div className="flex gap-3 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(lesson.date).toLocaleDateString('pt-BR')}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    {lesson.visibility === 'all' ? 'Visível para todos' : 'Apenas para a turma'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(lesson.youtubeUrl, '_blank')}
                                >
                                  Ver
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteLesson(lesson.id)}
                                >
                                  Excluir
                                </Button>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Nenhuma aula cadastrada para esta turma.
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modal para adicionar nova aula */}
      <Sheet open={isAddLessonOpen} onOpenChange={setIsAddLessonOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Adicionar Nova Aula</SheetTitle>
            <SheetDescription>
              Adicione uma nova aula em vídeo para seus alunos.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Aula *</Label>
              <Input 
                id="title" 
                placeholder="Digite o título da aula" 
                value={newLesson.title}
                onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input 
                id="description" 
                placeholder="Descrição breve do conteúdo" 
                value={newLesson.description}
                onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube-url">Link do YouTube *</Label>
              <Input 
                id="youtube-url" 
                placeholder="https://youtube.com/watch?v=..." 
                value={newLesson.youtubeUrl}
                onChange={(e) => setNewLesson({...newLesson, youtubeUrl: e.target.value})}
              />
              <p className="text-xs text-gray-500">Cole o link do vídeo não listado do YouTube</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data da Aula *</Label>
              <Input 
                id="date" 
                type="date" 
                value={newLesson.date}
                onChange={(e) => setNewLesson({...newLesson, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Turma *</Label>
              <Select 
                value={newLesson.class} 
                onValueChange={(value) => setNewLesson({...newLesson, class: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  {availableClasses.map(className => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="visibility">Visibilidade *</Label>
              <Select 
                value={newLesson.visibility} 
                onValueChange={(value: 'all' | 'class_only') => 
                  setNewLesson({...newLesson, visibility: value})
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a visibilidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class_only">Apenas para a turma selecionada</SelectItem>
                  <SelectItem value="all">Para todas as turmas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancelar</Button>
            </SheetClose>
            <Button onClick={handleAddLesson}>Adicionar Aula</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TeacherDashboard;
