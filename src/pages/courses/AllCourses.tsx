
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Search, ArrowRight, Clock, Star } from "lucide-react";

const AllCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const courses = [
    {
      id: 1,
      title: "Formação Completa em Quality Assurance",
      description: "Curso completo para se tornar um profissional de QA do zero ao avançado",
      type: "formacao",
      duration: "180 horas",
      level: "Iniciante ao Avançado",
      price: 1997,
      rating: 4.9,
      image: "https://placehold.co/600x400/e7fdfd/0f172a"
    },
    {
      id: 2,
      title: "Testes de API Rest",
      description: "Aprenda a testar APIs REST com Postman, Newman e RestAssured",
      type: "complementar",
      duration: "30 horas",
      level: "Intermediário",
      price: 397,
      rating: 4.9,
      image: "https://placehold.co/600x400/e9f6ff/0f172a"
    },
    {
      id: 3,
      title: "Selenium WebDriver com Java",
      description: "Domine a automação de testes web com o framework mais usado do mercado",
      type: "complementar",
      duration: "40 horas",
      level: "Intermediário",
      price: 497,
      rating: 4.8,
      image: "https://placehold.co/600x400/fdf4e7/0f172a"
    },
    {
      id: 4,
      title: "Testes de Performance com JMeter",
      description: "Aprenda a planejar e executar testes de carga, stress e performance",
      type: "complementar",
      duration: "25 horas",
      level: "Avançado",
      price: 397,
      rating: 4.7,
      image: "https://placehold.co/600x400/edfdf5/0f172a"
    },
    {
      id: 5,
      title: "Cucumber e BDD na Prática",
      description: "Implemente o Behavior Driven Development com Cucumber e Gherkin",
      type: "complementar",
      duration: "20 horas",
      level: "Intermediário",
      price: 297,
      rating: 4.9,
      image: "https://placehold.co/600x400/f4e7fd/0f172a"
    },
    {
      id: 6,
      title: "Testes Mobile com Appium",
      description: "Aprenda a automatizar testes para aplicativos iOS e Android",
      type: "complementar",
      duration: "35 horas",
      level: "Intermediário",
      price: 497,
      rating: 4.8,
      image: "https://placehold.co/600x400/e7effd/0f172a"
    },
    {
      id: 7,
      title: "Formação Especialista em Automação de Testes",
      description: "Torne-se um especialista em automação de testes web, API e mobile",
      type: "formacao",
      duration: "120 horas",
      level: "Intermediário ao Avançado",
      price: 1697,
      rating: 4.9,
      image: "https://placehold.co/600x400/ffecd9/0f172a"
    },
  ];
  
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-bestcode-50 py-12 sm:py-16">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Nossos Cursos de Quality Assurance</h1>
              <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
                Explore nossa oferta completa de cursos e formações para Quality Assurance.
                Do básico ao avançado, temos o curso ideal para impulsionar sua carreira.
              </p>
              
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Buscar cursos..."
                  className="pl-10 h-10 sm:h-12 text-sm sm:text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Courses */}
        <section className="py-12 sm:py-16">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="todos" className="mb-8 sm:mb-12">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 text-xs sm:text-sm">
                <TabsTrigger value="todos">Todos os Cursos</TabsTrigger>
                <TabsTrigger value="formacao">Formações</TabsTrigger>
                <TabsTrigger value="complementar">Complementares</TabsTrigger>
              </TabsList>
              
              <TabsContent value="todos" className="mt-6 sm:mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} formatPrice={formatPrice} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="formacao" className="mt-6 sm:mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {filteredCourses
                    .filter(course => course.type === "formacao")
                    .map((course) => (
                      <CourseCard key={course.id} course={course} formatPrice={formatPrice} />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="complementar" className="mt-6 sm:mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {filteredCourses
                    .filter(course => course.type === "complementar")
                    .map((course) => (
                      <CourseCard key={course.id} course={course} formatPrice={formatPrice} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Comparison */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center">Compare Nossos Planos</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl text-center">Curso Individual</CardTitle>
                  <div className="text-center mt-4">
                    <span className="text-3xl font-bold">A partir de R$ 297</span>
                    <p className="text-sm text-gray-500 mt-2">Pagamento único</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <span>Acesso a um curso específico</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <span>Certificado de conclusão</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <span>Acesso por 12 meses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <span>Suporte via fórum</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-bestcode-600 hover:bg-bestcode-700">
                    Escolher Curso
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border-2 border-bestcode-600 shadow-lg relative">
                <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-bestcode-600 text-white px-4 py-1 text-sm font-medium rounded-full">
                  Mais Popular
                </span>
                <CardHeader>
                  <CardTitle className="text-xl text-center">Formação Completa</CardTitle>
                  <div className="text-center mt-4">
                    <span className="text-3xl font-bold">R$ 1.997</span>
                    <p className="text-sm text-gray-500 mt-2">ou 12x de R$ 183</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <span>Formação completa em QA (180h)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <span>Certificado reconhecido pelo mercado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <span>Acesso por 18 meses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <span>Mentorias individuais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <span>Projetos práticos para portfólio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <span>Comunidade exclusiva de alunos</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-bestcode-600 hover:bg-bestcode-700">
                    Matricule-se Agora
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl text-center">Pacote Premium</CardTitle>
                  <div className="text-center mt-4">
                    <span className="text-3xl font-bold">R$ 2.997</span>
                    <p className="text-sm text-gray-500 mt-2">ou 12x de R$ 274</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <span>Formação completa em QA</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <span>3 cursos complementares à escolha</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <span>Acesso vitalício</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <span>Mentorias semanais individuais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <span>Suporte prioritário</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <span>Simulações de entrevistas</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-bestcode-600 hover:bg-bestcode-700">
                    Saiba Mais
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// Componente de Card de Curso
const CourseCard = ({ course, formatPrice }) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline" className={course.type === "formacao" 
            ? "bg-bestcode-100 text-bestcode-800 border-bestcode-200" 
            : "bg-blue-50 text-blue-800 border-blue-200"}>
            {course.type === "formacao" ? "Formação" : "Curso Complementar"}
          </Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-sm">{course.rating}</span>
          </div>
        </div>
        <CardTitle className="text-lg">{course.title}</CardTitle>
        <p className="text-sm text-gray-600 mt-2">{course.description}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Clock size={16} className="mr-1" />
          <span>{course.duration}</span>
          <span className="mx-2">•</span>
          <span>{course.level}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="font-bold text-bestcode-600">{formatPrice(course.price)}</div>
        <Link to={`/courses/details/${course.id}`}>
          <Button className="flex items-center bg-bestcode-600 hover:bg-bestcode-700">
            <span>Ver detalhes</span>
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default AllCourses;
