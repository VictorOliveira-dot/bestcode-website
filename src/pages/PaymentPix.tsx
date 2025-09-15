
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";

const PaymentPix = () => {
  const [pixData, setPixData] = useState<{ qrCodeUrl: string; paymentId: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar dados do PIX do localStorage
    const storedData = localStorage.getItem("pixPayment");
    if (!storedData) {
      navigate("/checkout");
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setPixData(parsedData);
    } catch (error) {
      
      navigate("/checkout");
    }
  }, [navigate]);

  const handleContinue = () => {
    navigate("/enrollment");
  };

  if (!pixData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom max-w-3xl">
          <Card className="shadow-lg">
            <CardHeader className="bg-green-50 border-b">
              <CardTitle className="flex items-center text-green-700">
                <Clock className="mr-2" size={24} />
                Pagamento PIX Gerado
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex flex-col items-center">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Escaneie o QR Code para pagar</h2>
                <p className="text-gray-600 mb-6">
                  Use o aplicativo do seu banco para escanear o código QR abaixo
                </p>
              </div>

              {pixData.qrCodeUrl ? (
                <div className="mb-8 p-4 border-2 border-gray-300 rounded-xl">
                  <img
                    src={pixData.qrCodeUrl}
                    alt="QR Code PIX"
                    className="w-64 h-64 mx-auto"
                  />
                </div>
              ) : (
                <div className="mb-8 p-4 border-2 border-gray-300 rounded-xl flex items-center justify-center">
                  <p>QR Code não disponível. Tente novamente.</p>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-md w-full mb-6">
                <h3 className="font-semibold mb-2">Importante:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>O pagamento PIX é processado instantaneamente</li>
                  <li>Após o pagamento, você receberá a confirmação por e-mail</li>
                  <li>
                    Em caso de problemas, entre em contato com nosso suporte: 
                    <a href="mailto:suporte@bestcode.com" className="text-bestcode-600 ml-1">
                      suporte@bestcode.com
                    </a>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/checkout")}
                >
                  Voltar para Checkout
                </Button>
                <Button 
                  className="flex-1 bg-bestcode-600 hover:bg-bestcode-700"
                  onClick={handleContinue}
                >
                  <CheckCircle className="mr-2" size={18} />
                  Já paguei
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

export default PaymentPix;
