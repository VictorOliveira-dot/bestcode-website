
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, ExternalLink } from "lucide-react";

const PaymentBoleto = () => {
  const [boletoData, setBoletoData] = useState<{ boletoUrl: string; paymentId: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar dados do boleto do localStorage
    const storedData = localStorage.getItem("boletoPayment");
    if (!storedData) {
      navigate("/checkout");
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setBoletoData(parsedData);
    } catch (error) {
      
      navigate("/checkout");
    }
  }, [navigate]);

  const openBoleto = () => {
    if (boletoData?.boletoUrl) {
      window.open(boletoData.boletoUrl, "_blank");
    }
  };

  if (!boletoData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom max-w-3xl">
          <Card className="shadow-lg">
            <CardHeader className="bg-amber-50 border-b">
              <CardTitle className="flex items-center text-amber-700">
                <FileText className="mr-2" size={24} />
                Boleto Bancário Gerado
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Seu boleto foi gerado com sucesso</h2>
                <p className="text-gray-600 mb-2">
                  Utilize o botão abaixo para acessar seu boleto para pagamento
                </p>
                <p className="text-sm text-gray-500">
                  O boleto também foi enviado para seu e-mail
                </p>
              </div>

              <div className="flex justify-center mb-8">
                <Button 
                  onClick={openBoleto} 
                  className="bg-bestcode-600 hover:bg-bestcode-700"
                  size="lg"
                >
                  <ExternalLink className="mr-2" size={18} />
                  Acessar Boleto
                </Button>
              </div>

              <div className="bg-blue-50 p-4 rounded-md w-full mb-6">
                <h3 className="font-semibold mb-2">Informações importantes:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>O boleto tem prazo de 3 dias úteis para pagamento</li>
                  <li>Após o pagamento, pode levar até 3 dias úteis para compensação</li>
                  <li>Seu acesso será liberado assim que o pagamento for confirmado</li>
                  <li>
                    Em caso de problemas, entre em contato com nosso suporte: 
                    <a href="mailto:suporte@bestcode.com" className="text-bestcode-600 ml-1">
                      suporte@bestcode.com
                    </a>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/checkout")}
                >
                  Voltar para Checkout
                </Button>
                <Button 
                  className="flex-1 bg-bestcode-600 hover:bg-bestcode-700"
                  onClick={() => navigate("/")}
                >
                  Ir para Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentBoleto;
