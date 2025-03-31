
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star } from "lucide-react";

const Complementary = () => {
  const courses = [
    {
      id: 1,
      title: "Testes de API Rest",
      description: "Aprenda a testar APIs REST com Postman, Newman e RestAssured",
      duration: "30 horas",
      level: "Intermediário",
      rating: 4.9,
      students: 1245,
      image: "https://placehold.co/600x400/e9f6ff/0f172a",
      popular: true
    },
    {
      id: 2,
      title: "Selenium WebDriver com Java",
      description: "Domine a automação de testes web com o framework mais usado do mercado",
      duration: "40 horas",
      level: "Intermediário",
      rating: 4.8,
      students: 2130,
      image: "https://placehold.co/600x400/fdf4e7/0f172a",
      popular: true
    },
    {
      id: 3,
      title: "Testes de Performance com JMeter",
      description: "Aprenda a planejar e executar testes de carga, stress e performance",
      duration: "25 horas",
      level: "Avançado",
      rating: 4.7,
      students: 870,
      image: "https://placehold.co/600x400/edfdf5/0f172a"
    },
    {
      id: 4,
      title: "Cucumber e BDD na Prática",
      description: "Implemente o Behavior Driven Development com Cucumber e Gherkin",
      duration: "20 horas",
      level: "Intermediário",
      rating: 4.9,
      students: 1560,
      image: "https://placehold.co/600x400/f4e7fd/0f172a",
      popular: true
    },
    {
      id: 5,
      title: "Testes de Segurança para QAs",
      description: "Fundamentos de segurança e vulnerabilidades para profissionais de QA",
      duration: "35 horas",
      level: "Avançado",
      rating: 4.8,
      students: 720,
      image: "https://placehold.co/600x400/e7effd/0f172a"
    },
    {
      id: 6,
      title: "Cypress: Testes End-to-End",
      description: "Automação moderna para aplicações web com Cypress",
      duration: "30 horas",
      level: "Intermediário",
      rating: 4.9,
      students: 1890,
      image: "https://placehold.co/600x400/f0f9e7/0f172a",
      popular: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-bestcode-50 py-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">Cursos Complementares em QA</h1>
              <p className="text-lg text-gray-700 mb-8">
                Expanda seus conhecimentos e especialize-se em áreas específicas de Quality Assurance
                com nossos cursos complementares de alta qualidade.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-bestcode-600 hover:bg-bestcode-700">
                  Explorar todos os cursos
                </Button>
                <Button variant="outline">
                  Filtrar por categoria
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Courses Grid */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden transition-all hover:shadow-md">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    {course.popular && (
                      <Badge className="absolute top-3 right-3 bg-bestcode-600">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                      <Badge variant="outline" className="bg-bestcode-50 text-bestcode-800 border-bestcode-200">
                        {course.level}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600 mt-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{course.students} alunos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="font-bold text-bestcode-600">R$ 397,00</span>
                    <Link to={`/courses/details/${course.id}`}>
                      <Button variant="outline" className="hover:bg-bestcode-50 hover:text-bestcode-600">
                        Ver detalhes
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" className="mx-auto">
                Carregar mais cursos
              </Button>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Perguntas Frequentes</h2>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Posso fazer apenas um curso complementar?</h3>
                  <p className="text-gray-600">
                    Sim, todos os nossos cursos complementares podem ser adquiridos individualmente. 
                    Você pode escolher aqueles que melhor atendem às suas necessidades de especialização.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Qual é o prazo para concluir um curso?</h3>
                  <p className="text-gray-600">
                    Você terá acesso ao conteúdo por 12 meses após a compra. O tempo médio para conclusão 
                    varia de acordo com a carga horária de cada curso, mas você pode estudar no seu próprio ritmo.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Os cursos incluem certificado?</h3>
                  <p className="text-gray-600">
                    Sim, todos os cursos complementares incluem certificado digital de conclusão, 
                    que será disponibilizado após a finalização de todas as atividades e avaliações.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Existe suporte ao aluno?</h3>
                  <p className="text-gray-600">
                    Sim, oferecemos suporte via fórum de discussão dentro da plataforma e sessões de 
                    dúvidas ao vivo quinzenais para todos os alunos dos cursos complementares.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Link to="/faq">
                  <Button variant="link" className="text-bestcode-600">
                    Ver todas as perguntas frequentes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-bestcode-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-6">Pronto para expandir seus conhecimentos em QA?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Escolha o curso complementar ideal para o seu desenvolvimento profissional e dê o próximo passo na sua carreira.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-bestcode-600 hover:bg-gray-100">
              Ver pacotes com desconto
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Complementary;
