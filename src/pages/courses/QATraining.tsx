
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, Award, Calendar } from "lucide-react";

const QATraining = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-bestcode-50 py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="bg-bestcode-100 text-bestcode-800 px-4 py-1 rounded-full text-sm font-medium">Formação Completa</span>
                <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">Formação Completa em Quality Assurance</h1>
                <p className="text-lg text-gray-700 mb-8">
                  Torne-se um profissional completo em QA com nossa formação abrangente. 
                  Do básico ao avançado, preparamos você para os desafios reais do mercado.
                </p>
                <div className="flex flex-wrap gap-4 items-center justify-center">
                  <a href="https://typebot.co/lead-magnet-r-ki-1-nuh59rv" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-bestcode-600 hover:bg-bestcode-700">
                      Matricule-se agora
                    </Button>
                  </a>
                </div>
                
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4">Próximas Turmas</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:border-bestcode-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-bestcode-600" size={24} />
                      <div>
                        <p className="font-medium">Turma Agosto/2025</p>
                        <p className="text-sm text-gray-600">Início em 15/09/2025</p>
                      </div>
                    </div>
                    <span className="text-sm bg-green-100 text-green-800 py-1 px-3 rounded-full">Turma aberta</span>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:border-bestcode-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-bestcode-600" size={24} />
                      <div>
                        <p className="font-medium">Turma Janeiro/2026</p>
                        <p className="text-sm text-gray-600">Início em janeiro de 2026</p>
                      </div>
                    </div>
                    <span className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full">Próxima turma</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Course Overview */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-12 text-center">Visão Geral do Curso</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-bestcode-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="text-bestcode-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Duração do Curso</h3>
                <p className="text-gray-600">
                  8 meses de formação intensiva, com aulas ao vivo semanais e conteúdo gravado para estudar no seu ritmo. 
                  Acesso aos materiais por 12 meses após a conclusão.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-bestcode-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="text-bestcode-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Certificação Reconhecida</h3>
                <p className="text-gray-600">
                  Receba um certificado valorizado pelo mercado, com carga horária completa e detalhamento 
                  das competências adquiridas durante o curso.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-bestcode-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="text-bestcode-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Suporte Contínuo</h3>
                <p className="text-gray-600">
                  Acesso a mentorias individuais, comunidade exclusiva de alunos e suporte técnico para 
                  dúvidas em todos os módulos do curso.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Curriculum */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-4 text-center">Conteúdo Programático</h2>
            <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
              Nossa formação abrange todos os aspectos essenciais para se tornar um profissional de QA completo,
              com conhecimentos sólidos em teoria e prática.
            </p>
            
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-bestcode-600">Módulo 1: Fundamentos de Quality Assurance</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Introdução à Qualidade de Software</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Ciclo de Vida do Desenvolvimento de Software</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Metodologias Ágeis e o papel do QA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Tipos e Níveis de Testes</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-bestcode-600">Módulo 2: Técnicas de Teste</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Casos de Teste e Cenários de Teste</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Técnicas de Design de Testes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Testes de Caixa Preta e Caixa Branca</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Gerenciamento de Bugs e Defeitos</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-bestcode-600">Módulo 3: Automação de Testes</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Introdução à Programação para QAs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Selenium WebDriver e Cucumber</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Testes de API com Postman e RestAssured</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>CI/CD e Integração com Ferramentas de Build</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-bestcode-600">Módulo 4: Testes Especializados</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Testes de Performance e Carga</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Testes de Segurança</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Testes de Usabilidade e Acessibilidade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Testes em Dispositivos Móveis</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-bestcode-600">Módulo 5: Projeto Prático Final</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Desenvolvimento de Estratégia de Testes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Implementação de Framework de Automação</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Execução de Testes em Projeto Real</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Apresentação e Defesa do Projeto</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-bestcode-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-6">Pronto para iniciar sua carreira em QA?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Inscreva-se agora e garanta o seu lugar na próxima turma da Formação Completa em Quality Assurance.
            </p>
            <Link to="https://typebot.co/lead-magnet-r-ki-1-nuh59rv" target="_blank">
              <Button size="lg" variant="secondary" className="bg-white text-bestcode-600 hover:bg-gray-100">
                Matricule-se agora
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default QATraining;
