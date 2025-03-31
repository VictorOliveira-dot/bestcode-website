
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-8">Termos de Serviço</h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Aceitação dos Termos</h2>
            <p>Ao acessar e utilizar os serviços da BestCode, você concorda com estes Termos de Serviço. Se você não concordar com qualquer parte destes termos, solicitamos que não utilize nossos serviços.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Descrição dos Serviços</h2>
            <p>A BestCode oferece cursos e treinamentos em Quality Assurance (QA) e áreas relacionadas, incluindo conteúdo online, mentorias, workshops e certificações. Nossos serviços são destinados a profissionais que desejam iniciar ou aprimorar suas habilidades em testes de software e garantia de qualidade.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Contas de Usuário</h2>
            <p>Para acessar determinados recursos da plataforma, você precisará criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades realizadas em sua conta. Notifique-nos imediatamente sobre qualquer uso não autorizado de sua conta.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Pagamentos e Reembolsos</h2>
            <p>As condições de pagamento, incluindo preços, métodos de pagamento e política de reembolso, serão especificadas no momento da compra. Oferecemos garantia de satisfação de 7 dias em nossos cursos, permitindo ao aluno solicitar reembolso integral caso não esteja satisfeito com o conteúdo neste período.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Propriedade Intelectual</h2>
            <p>Todo o conteúdo disponibilizado pela BestCode, incluindo mas não limitado a textos, gráficos, logotipos, imagens, vídeos, código-fonte e materiais de curso, é protegido por direitos autorais e outras leis de propriedade intelectual. O uso não autorizado deste conteúdo é estritamente proibido.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Conduta do Usuário</h2>
            <p>Ao utilizar nossos serviços, você concorda em não:</p>
            <ul className="list-disc pl-8 mb-4">
              <li>Violar quaisquer leis ou regulamentos aplicáveis</li>
              <li>Compartilhar suas credenciais de acesso com terceiros</li>
              <li>Distribuir ou compartilhar o conteúdo do curso sem autorização</li>
              <li>Apresentar comportamento abusivo ou desrespeitoso em interações na plataforma</li>
              <li>Tentar acessar áreas restritas da plataforma</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitação de Responsabilidade</h2>
            <p>A BestCode não oferece garantias de que os serviços atenderão a todos os requisitos do usuário ou que funcionarão sem interrupções. Não seremos responsáveis por danos indiretos, incidentais, especiais ou consequenciais resultantes do uso ou incapacidade de usar nossos serviços.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Modificações nos Termos</h2>
            <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor após a publicação dos termos atualizados. O uso contínuo de nossos serviços após tais alterações constitui aceitação dos novos termos.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Lei Aplicável</h2>
            <p>Estes termos são regidos pelas leis do Brasil. Qualquer disputa relacionada a estes termos será submetida à jurisdição exclusiva dos tribunais brasileiros.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contato</h2>
            <p>Se tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco pelo e-mail contato@bestcode.com ou pelo telefone (11) 99999-9999.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
