import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentForm from "@/components/checkout/PaymentForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para acessar esta página.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);

  const course = {
    title: "Formação Completa em QA",
    price: 1997.00,
    discount: 200.00,
    finalPrice: 1797.00,
    installments: 12,
    installmentPrice: 149.75
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Erro no pagamento",
        description: "Você precisa estar logado para completar a compra.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Validação básica dos campos dependendo do método de pagamento
      if (paymentMethod === "credit-card") {
        if (!cardData.cardName || !cardData.cardNumber || !cardData.cardExpiry || !cardData.cardCvc) {
          toast({
            title: "Dados incompletos",
            description: "Por favor, preencha todos os campos do cartão de crédito.",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
      }
      
      // Chamar a função Edge do Supabase para processar o pagamento
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          paymentMethod,
          cardData,
          course,
          userId: user.id // Pass the user ID to the function
        }
      });
      
      if (error) {
        throw new Error(error.message || "Ocorreu um erro ao processar o pagamento");
      }
      
      // Verificar o resultado do pagamento
      if (!data.success && paymentMethod === "credit-card") {
        toast({
          title: "Erro no pagamento",
          description: `O pagamento não foi aprovado. Motivo: ${data.status || "erro desconhecido"}`,
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
      
      // Tratamento específico para cada método de pagamento
      if (paymentMethod === "credit-card") {
        toast({
          title: "Pagamento processado com sucesso!",
          description: "Você será redirecionado para completar sua matrícula.",
          variant: "default",
        });
        
        // Redirecionar para a página de matrícula
        setTimeout(() => {
          navigate("/enrollment");
        }, 1500);
        
      } else if (paymentMethod === "pix") {
        // Para PIX, mostrar QR code
        toast({
          title: "PIX gerado com sucesso!",
          description: "Escaneie o QR code para finalizar o pagamento.",
          variant: "default",
        });
        
        // Armazenar dados do PIX no localStorage para exibição
        localStorage.setItem("pixPayment", JSON.stringify({
          qrCodeUrl: data.pixQrCode,
          paymentId: data.id,
        }));
        
        // Redirecionar para a página de PIX
        navigate("/payment/pix");
        
      } else if (paymentMethod === "bank-slip") {
        // Para boleto, mostrar link
        toast({
          title: "Boleto gerado com sucesso!",
          description: "Você será redirecionado para visualizar o boleto.",
          variant: "default",
        });
        
        // Armazenar URL do boleto no localStorage
        localStorage.setItem("boletoPayment", JSON.stringify({
          boletoUrl: data.boletoUrl,
          paymentId: data.id,
        }));
        
        // Redirecionar para a página do boleto ou abrir em nova aba
        window.open(data.boletoUrl, "_blank");
        navigate("/payment/boleto");
      }
      
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast({
        title: "Erro no pagamento",
        description: error.message || "Ocorreu um erro ao processar o pagamento.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // If no user, show loading or return null
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-gray-600 mt-1">Complete sua compra em poucos passos</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <OrderSummary course={course} />
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Pagamento</CardTitle>
                  <CardDescription>Escolha seu método de pagamento preferido</CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentForm 
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    cardData={cardData}
                    handleCardInputChange={handleCardInputChange}
                    course={course}
                    isProcessing={isProcessing}
                    handleSubmit={handleSubmit}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
