
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentForm from "@/components/checkout/PaymentForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const isCanceled = new URLSearchParams(location.search).get("canceled") === "true";

  // Course information - in a real app, this could come from an API or context
  const course = {
    title: "Formação Completa em QA",
    price: 1997.00,
    discount: 200.00,
    finalPrice: 1797.00,
    installments: 12,
    installmentPrice: 149.75
  };

  useEffect(() => {
    if (isCanceled) {
      toast.error("Pagamento cancelado. Você pode tentar novamente quando quiser.");
    }

    // Redirect to login if not authenticated
    if (!user) {
      toast.error("Você precisa estar logado para acessar esta página");
      navigate("/login");
      return;
    }

    // Check if user's profile is complete
    const checkProfileStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("is_profile_complete")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (!data || !data.is_profile_complete) {
          toast.error("Por favor, complete seu perfil antes de prosseguir");
          navigate("/profile-completion");
        } else {
          setIsProfileComplete(true);

          // Check if user is already active
          const { data: userData } = await supabase
            .from("users")
            .select("is_active")
            .eq("id", user.id)
            .single();

          if (userData?.is_active) {
            toast.info("Sua conta já está ativa. Redirecionando para a área de alunos.");
            navigate("/enrollment");
          }
        }
      } catch (error: any) {
        console.error("Error checking profile status:", error);
        toast.error("Erro ao verificar status do perfil");
      }
    };

    checkProfileStatus();
  }, [user, navigate, isCanceled]);

  const handleCardInputChange = (field: string, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Você precisa estar logado para completar a compra");
      navigate("/login");
      return;
    }
    
    if (!isProfileComplete) {
      toast.error("Por favor, complete seu perfil antes de prosseguir");
      navigate("/profile-completion");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // If using Stripe Checkout, call the process-payment endpoint differently
      if (paymentMethod === "checkout") {
        const { data, error } = await supabase.functions.invoke('process-payment', {
          body: {
            paymentMethod: "checkout",
            course,
            userId: user.id
          }
        });
        
        if (error) throw new Error(error.message || "Ocorreu um erro ao processar o pagamento");
        
        // Redirect to Stripe Checkout
        if (data?.url) {
          window.location.href = data.url;
          return;
        } else {
          throw new Error("URL de checkout não encontrada");
        }
      }
      
      // For other payment methods, use the existing flow
      // Validação básica dos campos dependendo do método de pagamento
      if (paymentMethod === "credit-card") {
        if (!cardData.cardName || !cardData.cardNumber || !cardData.cardExpiry || !cardData.cardCvc) {
          toast.error("Por favor, preencha todos os campos do cartão de crédito");
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
          userId: user.id
        }
      });
      
      if (error) {
        throw new Error(error.message || "Ocorreu um erro ao processar o pagamento");
      }
      
      // Verificar o resultado do pagamento
      if (!data.success) {
        toast.error(`O pagamento não foi aprovado. Motivo: ${data.status || "erro desconhecido"}`);
        setIsProcessing(false);
        return;
      }
      
      // Tratamento específico para cada método de pagamento
      if (paymentMethod === "credit-card") {
        toast.success("Pagamento processado com sucesso! Você será redirecionado para completar sua matrícula.");
        
        // Redirecionar para a página de matrícula
        setTimeout(() => {
          navigate("/enrollment");
        }, 1500);
      } else if (paymentMethod === "pix") {
        // Para PIX, mostrar QR code
        toast.success("PIX gerado com sucesso! Escaneie o QR code para finalizar o pagamento.");
        
        // Armazenar dados do PIX no localStorage para exibição
        localStorage.setItem("pixPayment", JSON.stringify({
          qrCodeUrl: data.pixQrCode,
          paymentId: data.id,
        }));
        
        // Redirecionar para a página de PIX
        navigate("/payment/pix");
      } else if (paymentMethod === "bank-slip") {
        // Para boleto, mostrar link
        toast.success("Boleto gerado com sucesso! Você será redirecionado para visualizar o boleto.");
        
        // Armazenar URL do boleto no localStorage
        localStorage.setItem("boletoPayment", JSON.stringify({
          boletoUrl: data.boletoUrl,
          paymentId: data.id,
        }));
        
        // Redirecionar para a página do boleto
        navigate("/payment/boleto");
      }
    } catch (error: any) {
      console.error("Erro ao processar pagamento:", error);
      toast.error(error.message || "Ocorreu um erro ao processar o pagamento");
    } finally {
      setIsProcessing(false);
    }
  };

  // If no user or still checking profile status, show loading
  if (!user || !isProfileComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bestcode-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom">
          <div>
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
