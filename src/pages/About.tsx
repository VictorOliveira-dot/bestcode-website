
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Award, Target, User, CheckCircle, Heart } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Carlos Silva",
      role: "CEO & Instrutor Principal",
      description: "Com mais de 15 anos de experiência em QA, Carlos liderou equipes de teste em grandes empresas de tecnologia antes de fundar a BestCode.",
      image: "https://placehold.co/400x400/fafafa/333"
    },
    {
      name: "Juliana Almeida",
      role: "Diretora Pedagógica",
      description: "Especialista em metodologias de ensino, Juliana desenvolve o currículo dos cursos para garantir o melhor aprendizado técnico e prático.",
      image: "https://placehold.co/400x400/fafafa/333"
    },
    {
      name: "Marcos Oliveira",
      role: "Instrutor de Automação",
      description: "Desenvolvedor e QA com foco em automação, Marcos é especialista em Selenium, Cypress e frameworks de teste modernos.",
      image: "https://placehold.co/400x400/fafafa/333"
    },
    {
      name: "Camila Santos",
      role: "Instrutora de API e Performance",
      description: "Especialista em testes de API e performance, Camila trabalhou em grandes projetos de e-commerce antes de se juntar à BestCode.",
      image: "https://placehold.co/400x400/fafafa/333"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-bestcode-50 py-20">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-6 bg-bestcode-100 text-bestcode-800 border-none">Nossa História</Badge>
              <h1 className="text-4xl font-bold mb-6">Transformando Profissionais em Especialistas de QA</h1>
              <p className="text-lg text-gray-700">
                Fundada em 2018 por um grupo de profissionais apaixonados por Quality Assurance,
                a BestCode nasceu com a missão de oferecer educação prática e de qualidade para
                formar os melhores profissionais do mercado.
              </p>
            </div>
          </div>
        </section>
        
        {/* Mission and Values */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-bestcode-50 border-none">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-bestcode-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="text-bestcode-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Nossa Missão</h3>
                  <p className="text-gray-700">
                    Capacitar profissionais de tecnologia com conhecimentos práticos e relevantes em Quality Assurance,
                    contribuindo para a evolução da qualidade de software no mercado.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-bestcode-50 border-none">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-bestcode-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="text-bestcode-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Nossa Visão</h3>
                  <p className="text-gray-700">
                    Ser reconhecida como a melhor instituição de ensino em Quality Assurance do Brasil,
                    formando profissionais preparados para os desafios reais do mercado.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-bestcode-50 border-none">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-bestcode-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="text-bestcode-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Nossos Valores</h3>
                  <p className="text-gray-700">
                    Excelência, Inovação, Foco no aluno, Aplicabilidade prática, Ética e transparência
                    são os valores que norteiam todas as nossas ações.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Timeline */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-12 text-center">Nossa Trajetória</h2>
            
            <div className="relative max-w-4xl mx-auto">
              {/* Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-bestcode-200"></div>
              
              {/* Timeline Items */}
              <div className="space-y-16">
                <TimelineItem 
                  year="2018" 
                  title="Fundação da BestCode" 
                  description="Início das operações com cursos presenciais de QA em São Paulo."
                  position="left"
                />
                
                <TimelineItem 
                  year="2019" 
                  title="Expansão dos Cursos" 
                  description="Lançamento da primeira versão online da Formação em QA e parcerias com empresas."
                  position="right"
                />
                
                <TimelineItem 
                  year="2020" 
                  title="Transformação Digital" 
                  description="Migração completa para o formato online e crescimento de 300% na base de alunos."
                  position="left"
                />
                
                <TimelineItem 
                  year="2021" 
                  title="Reconhecimento do Mercado" 
                  description="Premiada como melhor curso de QA do Brasil pela Associação Brasileira de Testes de Software."
                  position="right"
                />
                
                <TimelineItem 
                  year="2022" 
                  title="Internacionalização" 
                  description="Início da expansão para América Latina com cursos em espanhol e parcerias internacionais."
                  position="left"
                />
                
                <TimelineItem 
                  year="2023" 
                  title="Hoje" 
                  description="Mais de 10.000 alunos formados e taxa de empregabilidade de 92% após conclusão dos cursos."
                  position="right"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Team */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-12 text-center">Nossa Equipe</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-bestcode-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Stats */}
        <section className="py-16 bg-bestcode-600 text-white">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">10.000+</div>
                <p className="text-bestcode-100">Alunos Formados</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">15+</div>
                <p className="text-bestcode-100">Cursos Especializados</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">92%</div>
                <p className="text-bestcode-100">Taxa de Empregabilidade</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4.9/5</div>
                <p className="text-bestcode-100">Avaliação dos Alunos</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Methodology */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-12 text-center">Nossa Metodologia</h2>
            
            <Tabs defaultValue="pratica" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pratica">Aprendizado Prático</TabsTrigger>
                <TabsTrigger value="mentoria">Mentoria Contínua</TabsTrigger>
                <TabsTrigger value="mercado">Conexão com o Mercado</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pratica" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Aprendizado Baseado em Projetos Reais</h3>
                    <p className="text-gray-700 mb-6">
                      Nossa metodologia é focada na prática. Acreditamos que a melhor forma de aprender 
                      é fazendo, por isso todos os nossos cursos incluem projetos reais e desafios 
                      que simulam o dia a dia de um profissional de QA.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 mt-1" size={18} />
                        <span>Projetos práticos em todas as etapas do curso</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 mt-1" size={18} />
                        <span>Laboratórios virtuais para prática de ferramentas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 mt-1" size={18} />
                        <span>Simulações de ambientes reais de trabalho</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-100 p-8 rounded-xl">
                    <img 
                      src="https://placehold.co/600x400/e9f6ff/0f172a" 
                      alt="Aprendizado Prático" 
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="mentoria" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Mentoria Personalizada</h3>
                    <p className="text-gray-700 mb-6">
                      Cada aluno tem acesso a sessões de mentoria individuais com profissionais 
                      experientes que atuam no mercado. Estas sessões ajudam a direcionar o 
                      aprendizado e esclarecer dúvidas específicas.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 mt-1" size={18} />
                        <span>Mentorias individuais agendadas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 mt-1" size={18} />
                        <span>Feedback constante sobre projetos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 mt-1" size={18} />
                        <span>Orientação de carreira e preparação para entrevistas</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-100 p-8 rounded-xl">
                    <img 
                      src="https://placehold.co/600x400/fdf4e7/0f172a" 
                      alt="Mentoria Contínua" 
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="mercado" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Alinhamento com o Mercado</h3>
                    <p className="text-gray-700 mb-6">
                      Nosso conteúdo é constantemente atualizado para acompanhar as tendências 
                      e demandas do mercado. Mantemos parcerias com empresas para garantir que 
                      nossos alunos estejam preparados para os desafios reais.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 mt-1" size={18} />
                        <span>Conteúdo atualizado trimestralmente</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 mt-1" size={18} />
                        <span>Parcerias com empresas de tecnologia</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 mt-1" size={18} />
                        <span>Banco de talentos para oportunidades de emprego</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-100 p-8 rounded-xl">
                    <img 
                      src="https://placehold.co/600x400/edfdf5/0f172a" 
                      alt="Conexão com o Mercado" 
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// Componente para os itens da timeline
const TimelineItem = ({ year, title, description, position }) => {
  return (
    <div className={`relative flex items-center ${position === 'left' ? 'justify-end' : 'justify-start'}`}>
      {/* Dot */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-bestcode-600 z-10 border-4 border-white"></div>
      
      {/* Content */}
      <div className={`w-5/12 ${position === 'left' ? 'pr-12 text-right' : 'pl-12'}`}>
        <span className="inline-block bg-bestcode-100 text-bestcode-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
          {year}
        </span>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default About;
