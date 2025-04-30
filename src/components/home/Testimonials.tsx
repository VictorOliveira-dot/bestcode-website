
import React from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Rafael Mendes",
      role: "QA Engineer na TechCorp",
      content: "A formação em QA da BestCode foi um divisor de águas na minha carreira. Comecei do zero e hoje trabalho em uma grande empresa de tecnologia ganhando muito mais do que eu imaginava.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5
    },
    {
      id: 2,
      name: "Juliana Costa",
      role: "QA Lead na InnovaSoft",
      content: "Buscava aprimorar minhas habilidades em automação de testes e o curso da BestCode superou todas as expectativas. O conteúdo é atual e os professores têm ampla experiência no mercado.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5
    },
    {
      id: 3,
      name: "Pedro Almeida",
      role: "Analista de Testes Sênior",
      content: "A combinação de aulas teóricas e projetos práticos me deu a confiança necessária para avançar na carreira. Em menos de 6 meses após o curso, consegui uma promoção.",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg",
      rating: 4
    },
    {
      id: 4,
      name: "Carolina Silva",
      role: "Test Manager",
      content: "A BestCode oferece o melhor curso de QA do mercado. A abordagem prática e o suporte contínuo dos professores fazem toda a diferença no aprendizado.",
      avatar: "https://randomuser.me/api/portraits/women/58.jpg",
      rating: 5
    },
    {
      id: 5,
      name: "André Martins",
      role: "QA Automation Engineer",
      content: "O curso de automação com Selenium foi essencial para minha transição de carreira. A metodologia é excelente e o suporte dos instrutores é incrível.",
      avatar: "https://randomuser.me/api/portraits/men/15.jpg",
      rating: 5
    }
  ];

  return (
    <section className="section-padding bg-bestcode-900 text-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-2 mb-4">O que nossos alunos dizem</h2>
          <p className="text-bestcode-100 text-lg">
            Centenas de profissionais já transformaram suas carreiras com nossos cursos.
            Veja alguns depoimentos de alunos que já passaram pela BestCode.
          </p>
        </div>

        <Carousel className="max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2">
                <div className="h-full bg-bestcode-800/50 border border-bestcode-700/50 p-6 md:p-8 rounded-xl flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-bestcode-300 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"} 
                      />
                    ))}
                  </div>
                  
                  <p className="italic text-bestcode-100 flex-grow">"{testimonial.content}"</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute text-primary left-0 -translate-x-1/2 hover:bg-bestcode-700 hover:text-white" />
          <CarouselNext className="absolute text-primary right-0 translate-x-1/2 hover:bg-bestcode-700 hover:text-white"/>
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
