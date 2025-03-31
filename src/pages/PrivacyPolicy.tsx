
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introdução</h2>
            <p>A BestCode valoriza a privacidade de seus usuários e está comprometida em proteger suas informações pessoais. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você utiliza nossa plataforma e serviços.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Informações que Coletamos</h2>
            <p>Podemos coletar os seguintes tipos de informações:</p>
            <ul className="list-disc pl-8 mb-4">
              <li><strong>Informações de Cadastro:</strong> nome, endereço de e-mail, telefone, endereço, dados profissionais e educacionais.</li>
              <li><strong>Informações de Pagamento:</strong> dados de cartão de crédito, informações bancárias (processadas por gateways de pagamento seguros).</li>
              <li><strong>Dados de Uso:</strong> informações sobre como você interage com nossa plataforma, progresso nos cursos, conclusão de atividades.</li>
              <li><strong>Informações Técnicas:</strong> endereço IP, tipo de navegador, dispositivo utilizado, tempo de acesso.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Como Utilizamos Suas Informações</h2>
            <p>Utilizamos as informações coletadas para:</p>
            <ul className="list-disc pl-8 mb-4">
              <li>Fornecer, manter e melhorar nossos serviços</li>
              <li>Processar transações e gerenciar sua conta</li>
              <li>Personalizar sua experiência de aprendizado</li>
              <li>Enviar comunicações sobre cursos, atualizações e eventos</li>
              <li>Responder a suas solicitações e fornecer suporte</li>
              <li>Analisar tendências e comportamentos para melhorar nossos serviços</li>
              <li>Cumprir obrigações legais e proteger nossos direitos</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Compartilhamento de Informações</h2>
            <p>Podemos compartilhar suas informações nas seguintes circunstâncias:</p>
            <ul className="list-disc pl-8 mb-4">
              <li><strong>Prestadores de Serviços:</strong> empresas que nos auxiliam na operação da plataforma (processamento de pagamentos, hospedagem, análise de dados).</li>
              <li><strong>Parceiros de Negócios:</strong> quando oferecemos programas em conjunto com outras empresas.</li>
              <li><strong>Conformidade Legal:</strong> quando exigido por lei ou para proteger nossos direitos legais.</li>
              <li><strong>Consentimento:</strong> quando você autoriza o compartilhamento.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Segurança das Informações</h2>
            <p>Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Seus Direitos</h2>
            <p>De acordo com as leis de proteção de dados aplicáveis, você pode ter os seguintes direitos:</p>
            <ul className="list-disc pl-8 mb-4">
              <li>Acessar, corrigir ou excluir suas informações pessoais</li>
              <li>Restringir ou opor-se ao processamento de seus dados</li>
              <li>Solicitar a portabilidade de seus dados</li>
              <li>Retirar o consentimento para o processamento de dados (quando aplicável)</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Cookies e Tecnologias Semelhantes</h2>
            <p>Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, entender como nossa plataforma é utilizada e personalizar nossos serviços. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Alterações nesta Política</h2>
            <p>Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente estará sempre disponível em nossa plataforma. Recomendamos que você revise esta política regularmente.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contato</h2>
            <p>Se tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais, entre em contato com nosso Encarregado de Proteção de Dados pelo e-mail privacidade@bestcode.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
