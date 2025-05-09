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
import PaymentForm from "@/components/checkout/PaymentForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("checkout"); // Hardcoded to Stripe Checkout
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
  const isSuccess = new URLSearchParams(location.search).get("success") === "true";

  // Course information
  const course = {
    title: "Formação Completa em QA",
    price: 1997.00,
    discount: 200.00,
    finalPrice: 1797.00,
    installments: 12,
    installmentPrice: 149.75
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Pagamento realizado com sucesso! Redirecionando para a plataforma...");
      setTimeout(() => {
        navigate("/student/dashboard");
      }, 3000);
      return;
    }

    if (isCanceled) {
      toast.error("Pagamento cancelado. Você pode tentar novamente quando quiser.");
    }

    // If no user, redirect to registration
    if (!user) {
      toast.error("Você precisa estar registrado para acessar esta página");
      navigate("/register");
      return;
    }

    // Check if user's profile is complete and if user is already active
    const checkUserStatus = async () => {
      try {
        // Check if user is already active
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("is_active, role")
          .eq("id", user.id)
          .single();
          
        if (userError) throw userError;

        // Redirect non-students away
        if (userData && userData.role !== 'student') {
          toast.error("Apenas estudantes podem realizar pagamentos de cursos.");
          navigate("/");
          return;
        }
        
        // Redirect already active students
        if (userData?.is_active) {
          toast.info("Sua conta já está ativa. Redirecionando para a área de alunos.");
          navigate("/student/dashboard");
          return;
        }
          
        // Check if profile exists in user_profiles
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("is_profile_complete")
          .eq("id", user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError;
        }

        setIsProfileComplete(!!profileData?.is_profile_complete);
        
        if (!profileData?.is_profile_complete) {
          toast.info("Por favor, complete seu perfil antes de prosseguir");
          navigate("/inscricao");
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      }
    };

    if (user) {
      checkUserStatus();
    } else {
      toast.error("Você precisa estar logado para acessar esta página");
      navigate("/login");
    }
  }, [user, navigate, isCanceled, isSuccess]);

  const handleCardInputChange = (field: string, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar registrado para completar a compra");
      navigate("/register");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // We now only support Stripe Checkout
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
    } catch (error: any) {
      console.error("Erro ao processar pagamento:", error);
      toast.error(error.message || "Ocorreu um erro ao processar o pagamento");
    } finally {
      setIsProcessing(false);
    }
  };

  // Order summary component
  const OrderSummary = () => (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Curso</span>
            <span>{course.title}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Valor original</span>
            <span>R$ {course.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Desconto</span>
            <span>- R$ {course.discount.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>R$ {course.finalPrice.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <span>ou até {course.installments}x de R$ {course.installmentPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // If still checking profile status, show loading
  if (!isProfileComplete && user) {
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
                <OrderSummary />
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
