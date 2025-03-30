
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="heading-2 mb-6 text-gray-900">
                Pronto para iniciar sua jornada em QA?
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Inscreva-se hoje e dê o primeiro passo para se tornar um profissional 
                de QA altamente qualificado e valorizado pelo mercado. Oferecemos suporte 
                durante todo o seu percurso de aprendizado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-gray-800 hover:bg-gray-700 text-white">
                    Matricule-se Agora
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="text-gray-800 border-gray-800">
                    Fale com um Consultor
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Benefícios do nosso programa:
              </h3>
              <ul className="space-y-3">
                {[
                  "Aulas ao vivo com profissionais experientes",
                  "Conteúdo atualizado com as tendências do mercado",
                  "Projetos práticos para construir seu portfólio",
                  "Mentoria personalizada durante o curso",
                  "Comunidade ativa de alunos e ex-alunos",
                  "Certificado reconhecido pelo mercado",
                  "Suporte técnico via WhatsApp"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-gray-800 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
