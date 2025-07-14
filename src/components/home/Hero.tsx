
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
    <section className="bg-gradient-to-br from-bestcode-800 to-bestcode-950 text-white py-12 sm:py-16 md:py-20 lg:py-28 relative overflow-hidden text-start">
      {/* Padrão de Fundo */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="animate-slideRight">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
              Transforme-se em um especialista em
              <span className="text-bestcode-300 block mt-2">Quality Assurance</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8">
              Aprenda com os melhores profissionais do mercado e destaque-se em uma das 
              áreas que mais cresce na tecnologia. Formação completa para você iniciar ou 
              avançar na carreira de QA.
            </p>
            
            <ul className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-200 text-sm sm:text-base">
                  <CheckCircle2 className="text-bestcode-300 flex-shrink-0" size={18} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a href="https://typebot.co/lead-magnet-r-ki-1-nuh59rv" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button size="lg" className="bg-bestcode-500 hover:bg-bestcode-600 text-white w-full sm:w-auto text-sm sm:text-base px-6 py-3">
                  Matricule-se
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </a>
            </div>
          </div>
          
          <div className="relative mt-8 lg:mt-0 lg:block animate-slideUp">
            <div className="relative bg-white/10 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-lg shadow-xl border border-white/20">
              <div className="aspect-video rounded-md overflow-hidden">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/rk-pmBiGI5w"
                  title="Como nosso curso funciona"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-3 sm:mt-4">
                <h3 className="text-lg sm:text-xl font-semibold">Veja como funciona nossa plataforma</h3>
                <p className="text-gray-300 mt-2 text-sm sm:text-base">
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
