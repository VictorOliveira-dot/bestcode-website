
import React from "react";
import { 
  Code, Calendar, BookOpen, Users, Award, MessageSquare, Clock, Zap 
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Code size={24} />,
      title: "Conteúdo Prático",
      description: "Aprenda com projetos reais que simulam situações do dia a dia de um profissional de QA."
    },
    {
      icon: <Calendar size={24} />,
      title: "Agenda Flexível",
      description: "Agende sessões de mentoria quando precisar e receba lembretes de aulas e eventos."
    },
    {
      icon: <BookOpen size={24} />,
      title: "Material Completo",
      description: "Acesso a aulas gravadas, materiais de apoio e biblioteca de cursos complementares."
    },
    {
      icon: <Users size={24} />,
      title: "Comunidade Ativa",
      description: "Troque experiências com outros alunos e amplie seu networking profissional."
    },
    {
      icon: <Award size={24} />,
      title: "Certificado Valorizado",
      description: "Obtenha um certificado reconhecido pelo mercado ao concluir nossos cursos."
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Suporte Constante",
      description: "Tire dúvidas com professores e suporte técnico via WhatsApp e plataforma."
    },
    {
      icon: <Clock size={24} />,
      title: "Acesso Controlado",
      description: "Aproveite o conteúdo pelo tempo necessário com nosso sistema de prazos de acesso."
    },
    {
      icon: <Zap size={24} />,
      title: "Rápida Evolução",
      description: "Metodologia que garante aprendizado rápido e aplicação imediata no mercado de trabalho."
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-2 mb-4">Por que escolher a BestCode?</h2>
          <p className="text-gray-600 text-lg">
            Nossa plataforma foi desenvolvida para oferecer a melhor experiência de aprendizado em QA, 
            combinando teoria e prática para formar profissionais completos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-bestcode-50 text-bestcode-600 rounded-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
