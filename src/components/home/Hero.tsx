
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const Hero = () => {
  const benefits = [
    "Aulas ao vivo e gravadas",
    "Mentoria com profissionais",
    "Projetos práticos reais",
    "Certificado reconhecido"
  ];

  return (
    <section className="bg-gradient-to-br from-bestcode-800 to-bestcode-950 text-white py-20 md:py-28 relative overflow-hidden">
      {/* Padrão de Fundo */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slideRight">
            <h1 className="heading-1 mb-6">
              Transforme-se em um especialista em
              <span className="text-bestcode-300 block mt-2">Quality Assurance</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              Aprenda com os melhores profissionais do mercado e destaque-se em uma das 
              áreas que mais cresce na tecnologia. Formação completa para você iniciar ou 
              avançar na carreira de QA.
            </p>
            
            <ul className="mb-8 space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-200">
                  <CheckCircle2 className="text-bestcode-300" size={20} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/courses/qa-training">
                <Button size="lg" className="bg-bestcode-500 hover:bg-bestcode-600 text-white">
                  Conheça Nossos Cursos
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline" className="text-white border-white">
                  Como Funciona
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative hidden lg:block animate-slideUp">
            <div className="relative bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-white/20">
              <div className="aspect-video rounded-md overflow-hidden">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                  title="Como nosso curso funciona"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold">Veja como funciona nossa plataforma</h3>
                <p className="text-gray-300 mt-2">
                  Assista ao vídeo para conhecer melhor nossa metodologia e como 
                  podemos ajudar na sua carreira.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
