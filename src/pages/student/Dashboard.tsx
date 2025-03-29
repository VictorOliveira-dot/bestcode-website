
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Play, 
  Award, 
  Bell, 
  CheckCircle, 
  FileText,
  MessageSquare
} from "lucide-react";

const StudentDashboard = () => {
  const user = {
    name: "Ana Silva",
    course: "Formação Completa em QA"
  };

  const courseProgress = 35;
  
  const upcomingClasses = [
    {
      id: 1,
      title: "Introdução ao Cypress",
      date: "15/05/2023",
      time: "19:00 - 21:00",
      instructor: "Ricardo Martins",
      type: "Live"
    },
    {
      id: 2,
      title: "Estratégias de Teste",
      date: "18/05/2023",
      time: "19:00 - 21:00",
      instructor: "Carla Santos",
      type: "Live"
    }
  ];
  
  const modules = [
    {
      id: 1,
      title: "Fundamentos de Quality Assurance",
      classes: 8,
      completed: 8,
      progress: 100
    },
    {
      id: 2,
      title: "Testes Manuais e Documentação",
      classes: 10,
      completed: 7,
      progress: 70
    },
    {
      id: 3,
      title: "Automação de Testes com Selenium",
      classes: 12,
      completed: 0,
      progress: 0
    },
    {
      id: 4,
      title: "Testes de API com Postman",
      classes: 8,
      completed: 0,
      progress: 0
    }
  ];
  
  const complementaryCourses = [
    {
      id: 1,
      title: "Git & GitHub para QAs",
      duration: "4 horas",
      level: "Iniciante",
      image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      title: "Relatórios de Teste Eficientes",
      duration: "3 horas",
      level: "Intermediário",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 3,
      title: "DevOps para QAs",
      duration: "6 horas",
      level: "Avançado",
      image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-1">Olá, {user.name}!</h1>
            <p className="text-gray-600">Bem-vindo(a) à sua área de estudos.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Seu progresso no curso</CardTitle>
                  <CardDescription>
                    {user.course}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        {courseProgress}% concluído
                      </div>
                      <div className="text-sm text-gray-500">
                        <CheckCircle size={16} className="inline-block mr-1 text-green-500" />
                        15/45 aulas
                      </div>
                    </div>
                    <Progress value={courseProgress} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/student/course" className="w-full">
                    <Button className="w-full bg-bestcode-600 hover:bg-bestcode-700">
                      <Play size={16} className="mr-1" />
                      Continuar estudando
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar size={18} className="text-bestcode-600" />
                        Próximas aulas
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Ver todas
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      {upcomingClasses.map((cls) => (
                        <div key={cls.id} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                          <div className="p-2 bg-bestcode-50 text-bestcode-600 rounded-md">
                            <Clock size={16} />
                          </div>
                          <div>
                            <h4 className="font-medium">{cls.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {cls.date} • {cls.time}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {cls.instructor} • {cls.type}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to="/student/calendar" className="w-full">
                      <Button variant="outline" className="w-full">
                        Agenda completa
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bell size={18} className="text-bestcode-600" />
                        Lembretes
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Ver todos
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 border-b pb-3">
                        <div className="p-2 bg-yellow-50 text-yellow-600 rounded-md">
                          <Bell size={16} />
                        </div>
                        <div>
                          <h4 className="font-medium">Entrega de projeto</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Prazo: 20/05/2023
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Projeto do módulo 2: Plano de testes
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                        <div className="p-2 bg-red-50 text-red-600 rounded-md">
                          <Clock size={16} />
                        </div>
                        <div>
                          <h4 className="font-medium">Prazo de acesso</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Restam 320 dias de acesso
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Acesso até 15/04/2024
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Configurar notificações
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Módulos do curso</CardTitle>
                  <CardDescription>
                    Acompanhe seu progresso em cada módulo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {modules.map((module) => (
                      <div key={module.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{module.title}</h4>
                          <span className="text-sm text-gray-500">
                            {module.completed}/{module.classes} aulas
                          </span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/student/course" className="w-full">
                    <Button variant="outline" className="w-full">
                      Ver detalhes do curso
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              <Tabs defaultValue="materials" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="materials">Materiais</TabsTrigger>
                  <TabsTrigger value="support">Suporte</TabsTrigger>
                </TabsList>
                <TabsContent value="materials" className="space-y-4 pt-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-bestcode-50 text-bestcode-600 rounded-md">
                        <FileText size={16} />
                      </div>
                      <h4 className="font-medium">Materiais de Apoio</h4>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="#" className="text-bestcode-600 hover:text-bestcode-800 flex items-center gap-1">
                          <span>Glossário de QA</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-bestcode-600 hover:text-bestcode-800 flex items-center gap-1">
                          <span>Template de Plano de Testes</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-bestcode-600 hover:text-bestcode-800 flex items-center gap-1">
                          <span>Guia Rápido de Selenium</span>
                        </a>
                      </li>
                    </ul>
                    <Button variant="ghost" size="sm" className="w-full mt-3 text-xs">
                      Ver todos os materiais
                    </Button>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-bestcode-50 text-bestcode-600 rounded-md">
                        <Award size={16} />
                      </div>
                      <h4 className="font-medium">Certificados</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Você receberá seu certificado após concluir o curso.
                    </p>
                    <div className="text-center p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-500">
                        Progresso necessário: 100%
                      </p>
                      <Progress value={courseProgress} className="h-2 mt-2" />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="support" className="space-y-4 pt-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-50 text-green-600 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                        </svg>
                      </div>
                      <h4 className="font-medium">Suporte via WhatsApp</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Tire dúvidas rápidas diretamente via WhatsApp com nossa equipe de suporte.
                    </p>
                    <a 
                      href="https://api.whatsapp.com/send?phone=5511999999999" 
                      className="button-primary w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                      </svg>
                      Falar com o suporte
                    </a>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-bestcode-50 text-bestcode-600 rounded-md">
                        <MessageSquare size={16} />
                      </div>
                      <h4 className="font-medium">Dúvidas no Fórum</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Participe do fórum da comunidade e receba ajuda de professores e outros alunos.
                    </p>
                    <Button className="w-full bg-bestcode-600 hover:bg-bestcode-700">
                      Acessar o fórum
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Cursos complementares</CardTitle>
                  <CardDescription>
                    Expanda seu conhecimento com cursos extras
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {complementaryCourses.map((course) => (
                      <div key={course.id} className="relative overflow-hidden group">
                        <div className="h-24 w-full relative">
                          <img 
                            src={course.image} 
                            alt={course.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
                          <div className="absolute bottom-0 left-0 p-3 w-full">
                            <h4 className="font-medium text-white text-sm">{course.title}</h4>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-200">{course.duration}</span>
                              <span className="text-xs bg-bestcode-500 text-white px-2 py-0.5 rounded">
                                {course.level}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Link to="/student/complementary-courses" className="w-full">
                    <Button variant="outline" className="w-full">
                      Ver todos os cursos
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
