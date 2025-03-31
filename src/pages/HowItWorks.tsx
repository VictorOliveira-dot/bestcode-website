
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Laptop, Video, Users, MessageSquare, Award, FileCheck } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Escolha seu curso",
      description: "Navegue por nossa oferta de cursos e escolha o que melhor atende às suas necessidades, seja uma formação completa ou um curso específico.",
      icon: <Laptop className="w-12 h-12 text-bestcode-600" />
    },
    {
      id: 2,
      title: "Estude no seu ritmo",
      description: "Acesse aulas gravadas e materiais complementares quando quiser. Nosso conteúdo está disponível 24/7 para você estudar conforme sua disponibilidade.",
      icon: <Video className="w-12 h-12 text-bestcode-600" />
    },
    {
      id: 3,
      title: "Participe de sessões ao vivo",
      description: "Conecte-se com professores e colegas em aulas ao vivo semanais, tire suas dúvidas e participe de discussões em tempo real.",
      icon: <Users className="w-12 h-12 text-bestcode-600" />
    },
    {
      id: 4,
      title: "Receba mentorias individuais",
      description: "Agende mentorias personalizadas com profissionais experientes para orientação específica sobre seus projetos e carreira.",
      icon: <MessageSquare className="w-12 h-12 text-bestcode-600" />
    },
    {
      id: 5,
      title: "Complete projetos práticos",
      description: "Aplique seu conhecimento em projetos reais que simulam ambientes profissionais e construa um portfólio sólido.",
      icon: <FileCheck className="w-12 h-12 text-bestcode-600" />
    },
    {
      id: 6,
      title: "Obtenha sua certificação",
      description: "Ao completar o curso com sucesso, receba um certificado reconhecido pelo mercado que valoriza sua nova qualificação.",
      icon: <Award className="w-12 h-12 text-bestcode-600" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-bestcode-50 py-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">Como Funciona a BestCode</h1>
              <p className="text-lg text-gray-700 mb-8">
                Entenda como nossa metodologia de ensino funciona e como transformamos 
                iniciantes em profissionais qualificados de QA prontos para o mercado.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/courses">
                  <Button className="bg-bestcode-600 hover:bg-bestcode-700">
                    Ver cursos disponíveis
                  </Button>
                </Link>
                <Link to="/faq">
                  <Button variant="outline">
                    Perguntas frequentes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Step by Step Process */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-12 text-center">Sua Jornada de Aprendizado</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {steps.map((step) => (
                <Card key={step.id} className="border border-gray-100 hover:border-bestcode-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-bestcode-50 flex items-center justify-center">
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-center">
                      <span className="inline-block w-7 h-7 bg-bestcode-600 text-white rounded-full text-sm mr-2">
                        {step.id}
                      </span>
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-center">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Learning Methods */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-12 text-center">Métodos de Aprendizado</h2>
            
            <Tabs defaultValue="online" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="online">Aulas Online</TabsTrigger>
                <TabsTrigger value="pratico">Projetos Práticos</TabsTrigger>
                <TabsTrigger value="mentoria">Mentorias</TabsTrigger>
              </TabsList>
              
              <TabsContent value="online" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Aprendizado Flexível e Interativo</h3>
                    <p className="text-gray-700 mb-6">
                      Nossa plataforma de ensino oferece o melhor dos dois mundos: aulas gravadas de alta qualidade 
                      que você pode assistir no seu próprio ritmo e sessões ao vivo para interagir com instrutores e colegas.
                    </p>
                    
                    <h4 className="font-bold mb-2">Aulas Gravadas:</h4>
                    <ul className="list-disc pl-5 mb-4 text-gray-700">
                      <li>Conteúdo estruturado e detalhado</li>
                      <li>Disponível 24/7 para estudo no seu ritmo</li>
                      <li>Possibilidade de revisão quantas vezes necessário</li>
                      <li>Recursos complementares para download</li>
                    </ul>
                    
                    <h4 className="font-bold mb-2">Sessões ao Vivo:</h4>
                    <ul className="list-disc pl-5 text-gray-700">
                      <li>Interação direta com instrutores</li>
                      <li>Resolução de dúvidas em tempo real</li>
                      <li>Workshops práticos e coding sessions</li>
                      <li>Networking com outros alunos</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <img 
                      src="https://placehold.co/600x400/e9f6ff/0f172a" 
                      alt="Plataforma de Ensino" 
                      className="rounded-lg mb-4"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-bestcode-50 p-4 rounded-lg text-center">
                        <h4 className="font-bold text-bestcode-600 mb-1">+200</h4>
                        <p className="text-sm">Horas de conteúdo</p>
                      </div>
                      <div className="bg-bestcode-50 p-4 rounded-lg text-center">
                        <h4 className="font-bold text-bestcode-600 mb-1">12</h4>
                        <p className="text-sm">Sessões ao vivo por mês</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="pratico" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Aprenda na Prática</h3>
                    <p className="text-gray-700 mb-6">
                      Acreditamos que a melhor forma de aprender QA é praticando. Por isso, nossos cursos são estruturados 
                      em torno de projetos reais que simulam os desafios encontrados no mercado de trabalho.
                    </p>
                    
                    <h4 className="font-bold mb-2">Projetos do Curso:</h4>
                    <ul className="list-disc pl-5 mb-4 text-gray-700">
                      <li>Criação de planos de teste completos</li>
                      <li>Implementação de automação de testes</li>
                      <li>Testes de aplicações web e mobile reais</li>
                      <li>Integração com pipelines CI/CD</li>
                    </ul>
                    
                    <h4 className="font-bold mb-2">Benefícios:</h4>
                    <ul className="list-disc pl-5 text-gray-700">
                      <li>Portfólio profissional ao fim do curso</li>
                      <li>Experiência prática com ferramentas do mercado</li>
                      <li>Desenvolvimento de pensamento crítico</li>
                      <li>Preparação para desafios reais de trabalho</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <img 
                      src="https://placehold.co/600x400/fdf4e7/0f172a" 
                      alt="Projetos Práticos" 
                      className="rounded-lg mb-4"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-bestcode-50 p-4 rounded-lg text-center">
                        <h4 className="font-bold text-bestcode-600 mb-1">+50</h4>
                        <p className="text-sm">Exercícios práticos</p>
                      </div>
                      <div className="bg-bestcode-50 p-4 rounded-lg text-center">
                        <h4 className="font-bold text-bestcode-600 mb-1">+12</h4>
                        <p className="text-sm">Projetos para portfólio</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="mentoria" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Mentorias Personalizadas</h3>
                    <p className="text-gray-700 mb-6">
                      O diferencial da BestCode são nossas mentorias individuais com profissionais experientes do mercado.
                      Este acompanhamento garante que você receba orientação específica para suas necessidades.
                    </p>
                    
                    <h4 className="font-bold mb-2">Como Funcionam:</h4>
                    <ul className="list-disc pl-5 mb-4 text-gray-700">
                      <li>Sessões agendadas de 30-60 minutos</li>
                      <li>Feedback personalizado sobre seus projetos</li>
                      <li>Orientação de carreira e desenvolvimento profissional</li>
                      <li>Suporte para dúvidas técnicas específicas</li>
                    </ul>
                    
                    <h4 className="font-bold mb-2">Nossos Mentores:</h4>
                    <ul className="list-disc pl-5 text-gray-700">
                      <li>Profissionais atuantes em grandes empresas</li>
                      <li>Especialistas em diferentes áreas de QA</li>
                      <li>Experiência real de mercado</li>
                      <li>Rede de contatos valiosa</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <img 
                      src="https://placehold.co/600x400/edfdf5/0f172a" 
                      alt="Mentorias" 
                      className="rounded-lg mb-4"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-bestcode-50 p-4 rounded-lg text-center">
                        <h4 className="font-bold text-bestcode-600 mb-1">+30</h4>
                        <p className="text-sm">Mentores especializados</p>
                      </div>
                      <div className="bg-bestcode-50 p-4 rounded-lg text-center">
                        <h4 className="font-bold text-bestcode-600 mb-1">+500</h4>
                        <p className="text-sm">Horas de mentoria por mês</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Student Journey */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-12 text-center">Jornada do Aluno</h2>
            
            <div className="relative max-w-5xl mx-auto">
              {/* Horizontal Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-bestcode-100"></div>
              
              {/* Journey Steps */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                <JourneyStep 
                  number="1" 
                  title="Onboarding" 
                  description="Orientação inicial, configuração do ambiente e introdução à plataforma."
                />
                
                <JourneyStep 
                  number="2" 
                  title="Aprendizado Fundamental" 
                  description="Conceitos básicos, fundamentos teóricos e introdução às ferramentas."
                />
                
                <JourneyStep 
                  number="3" 
                  title="Aplicação Prática" 
                  description="Projetos reais, simulações de ambiente de trabalho e desafios práticos."
                />
                
                <JourneyStep 
                  number="4" 
                  title="Preparação para o Mercado" 
                  description="Projeto final, simulações de entrevista e certificação."
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 bg-bestcode-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-12">O Que Dizem Nossos Alunos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white/10 border-none text-white p-6">
                <CardContent className="p-0">
                  <p className="italic mb-6">
                    "A metodologia da BestCode me transformou de um iniciante completo em QA para um profissional 
                    confiante em apenas 6 meses. As mentorias foram fundamentais para o meu desenvolvimento."
                  </p>
                  <div>
                    <p className="font-bold">Rodrigo Almeida</p>
                    <p className="text-bestcode-200">QA Engineer na TechCorp</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-none text-white p-6">
                <CardContent className="p-0">
                  <p className="italic mb-6">
                    "Os projetos práticos fizeram toda a diferença. Consegui montar um portfólio sólido que me 
                    ajudou a conseguir meu primeiro emprego na área antes mesmo de terminar o curso."
                  </p>
                  <div>
                    <p className="font-bold">Marina Santos</p>
                    <p className="text-bestcode-200">QA Analyst na Global Software</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-none text-white p-6">
                <CardContent className="p-0">
                  <p className="italic mb-6">
                    "Depois de 10 anos como dev, decidi migrar para QA. A formação da BestCode me deu exatamente 
                    o que eu precisava para fazer essa transição com confiança e sucesso."
                  </p>
                  <div>
                    <p className="font-bold">André Oliveira</p>
                    <p className="text-bestcode-200">QA Lead na FinTech Solutions</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12">
              <Link to="/testimonials">
                <Button variant="secondary" className="bg-white text-bestcode-600 hover:bg-gray-100">
                  Ver mais depoimentos
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* FAQ Teaser */}
        <section className="py-16">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-6">Ainda tem dúvidas?</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
              Confira nossa página de perguntas frequentes para encontrar respostas para as dúvidas mais comuns 
              sobre nossos cursos, metodologia e suporte.
            </p>
            <Link to="/faq">
              <Button className="bg-bestcode-600 hover:bg-bestcode-700">
                Ver perguntas frequentes
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// Componente de Step da Jornada
const JourneyStep = ({ number, title, description }) => {
  return (
    <div className="flex flex-col items-center relative">
      <div className="w-16 h-16 rounded-full bg-bestcode-600 text-white font-bold text-xl flex items-center justify-center z-10 border-4 border-white">
        {number}
      </div>
      <div className="text-center mt-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default HowItWorks;
