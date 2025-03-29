
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Preciso ter conhecimento prévio em programação?",
      answer: "Não é necessário ter conhecimento prévio em programação para iniciar nossos cursos de QA. Os cursos são estruturados para começar do básico e avançar gradualmente. Para cursos mais avançados de automação, recomendamos conhecimentos básicos de lógica de programação, mas também oferecemos módulos introdutórios para quem está começando do zero."
    },
    {
      question: "Quanto tempo tenho acesso ao conteúdo do curso?",
      answer: "O acesso ao conteúdo varia conforme o curso escolhido. Geralmente, nossos cursos oferecem acesso por 12 meses após a matrícula. Para formações completas, esse prazo pode ser estendido. Você pode verificar o prazo específico na descrição de cada curso antes de se matricular."
    },
    {
      question: "As aulas são ao vivo ou gravadas?",
      answer: "Oferecemos um modelo híbrido. Temos aulas gravadas que você pode assistir no seu próprio ritmo e também sessões ao vivo semanais para tirar dúvidas, participar de workshops práticos e interagir com professores e outros alunos. As sessões ao vivo são gravadas para quem não puder participar."
    },
    {
      question: "Como funciona a certificação?",
      answer: "Para obter o certificado, você precisa completar todos os módulos do curso e atingir uma pontuação mínima nos projetos práticos e avaliações. Nossos certificados são reconhecidos pelo mercado e podem ser verificados online através de um código único."
    },
    {
      question: "Consigo uma vaga no mercado após concluir o curso?",
      answer: "Embora não possamos garantir empregos, nossos cursos são desenvolvidos com foco nas habilidades mais valorizadas pelo mercado. Oferecemos também módulos de preparação para entrevistas e ajudamos na construção do seu portfólio. Muitos de nossos alunos conseguem colocação profissional em até 6 meses após a conclusão."
    },
    {
      question: "Como funcionam as mentorias?",
      answer: "As mentorias são sessões individuais ou em pequenos grupos com profissionais experientes do mercado. Você pode agendar mentorias através da plataforma, escolhendo horários disponíveis que melhor se adequem à sua rotina. Durante as sessões, você pode discutir projetos, esclarecer dúvidas técnicas ou buscar orientação de carreira."
    },
    {
      question: "Posso pagar o curso em parcelas?",
      answer: "Sim, oferecemos diversas opções de pagamento, incluindo parcelamento em até 12x no cartão de crédito. Também oferecemos descontos especiais para pagamento à vista. Consulte as condições disponíveis no momento da matrícula."
    },
    {
      question: "O que acontece se eu não gostar do curso?",
      answer: "Oferecemos garantia de satisfação de 7 dias. Se você não ficar satisfeito com o curso, pode solicitar o cancelamento e reembolso integral dentro deste período, sem precisar apresentar justificativas."
    }
  ];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="heading-2 mb-4">Perguntas Frequentes</h2>
          <p className="text-gray-600 text-lg">
            Tire suas dúvidas sobre nossos cursos e metodologia. Se não encontrar o que
            procura, entre em contato com nossa equipe de suporte.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Ainda tem dúvidas? Entre em contato com nossa equipe de suporte.
            </p>
            <a 
              href="https://api.whatsapp.com/send?phone=5511999999999" 
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              Fale conosco via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
