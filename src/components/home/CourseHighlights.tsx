
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CourseHighlights = () => {
  const featuredCourses = [
    {
      id: 1,
      title: "Formação Completa em QA",
      description: "Um programa completo que aborda desde os fundamentos de testes até técnicas avançadas de automação.",
      category: "Formação Completa",
      duration: "120 horas",
      level: "Iniciante ao Avançado",
      imageSrc: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      link: "/courses/qa-training"
    },
    {
      id: 2,
      title: "Testes Automatizados com Selenium",
      description: "Aprenda a criar testes automatizados eficientes utilizando Selenium WebDriver e Java.",
      category: "Automação",
      duration: "40 horas",
      level: "Intermediário",
      imageSrc: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      link: "/courses/selenium-automation"
    },
    {
      id: 3,
      title: "Testes de API com Postman",
      description: "Domine o processo de teste de APIs REST com Postman e automatize validações com scripts.",
      category: "Testes de API",
      duration: "30 horas",
      level: "Intermediário",
      imageSrc: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      link: "/courses/api-testing"
    }
  ];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div className="max-w-2xl">
            <h2 className="heading-2 mb-4">Nossos Cursos em Destaque</h2>
            <p className="text-gray-600 text-lg">
              Conheça alguns de nossos cursos mais populares, projetados para desenvolver 
              habilidades práticas e valorizadas pelo mercado de trabalho.
            </p>
          </div>
          <Link to="/courses" className="mt-4 md:mt-0 group">
            <Button variant="outline" className="flex items-center gap-2">
              Ver Todos os Cursos
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={course.imageSrc} 
                  alt={course.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium px-2.5 py-0.5 bg-bestcode-100 text-bestcode-800 rounded-full">
                    {course.category}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    {course.duration}
                  </span>
                </div>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-gray-700">
                  Nível: {course.level}
                </p>
              </CardContent>
              <CardFooter>
                <Link to={course.link} className="w-full">
                  <Button className="w-full bg-bestcode-600 hover:bg-bestcode-700">
                    Saiba Mais
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseHighlights;
