
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
import { toast } from "@/components/ui/use-toast";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("pix"); // Default to PIX (cheapest option)
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

  // Course information with dynamic pricing based on payment method
  const [course, setCourse] = useState({
    title: "Formação Completa em QA",
    price: 4999.00,
    discount: 999.00,
    finalPrice: 4000.00, // Default to PIX price (4000)
    installments: 12,
    installmentPrice: 374.91
  });

  // Update pricing based on payment method
  useEffect(() => {
    if (paymentMethod === "pix" || paymentMethod === "credit-full") {
      setCourse(prev => ({
        ...prev,
        discount: 999.00,
        finalPrice: 4000.00
      }));
    } else if (paymentMethod === "credit-installments" || paymentMethod === "boleto") {
      setCourse(prev => ({
        ...prev,
        discount: 0.00,
        finalPrice: 4499.00 // Total price for installments (12 × 374.91 = 4,498.92)
      }));
    }
  }, [paymentMethod]);

  useEffect(() => {
    if (isSuccess) {
      // Quando o pagamento for bem-sucedido, atualizar o status is_active do usuário
      const updateUserStatus = async () => {
        try {
          if (user) {
            const { error } = await supabase
              .from('users')
              .update({ is_active: true })
              .eq('id', user.id);
              
            if (error) {
              console.error("Error updating user status:", error);
              toast({
                title: "Erro na ativação da conta",
                description: "Ocorreu um problema ao ativar sua conta, mas seu pagamento foi processado com sucesso.",
                variant: "destructive"
              });
            } else {
              toast({
                title: "Pagamento realizado com sucesso!",
                description: "Sua conta foi ativada. Redirecionando para a plataforma..."
              });
            }
          }
          
          // Redirect to dashboard regardless of update success
          setTimeout(() => {
            navigate("/student/dashboard");
          }, 3000);
        } catch (error) {
          console.error("Error in payment success handler:", error);
          toast({
            title: "Erro no processamento",
            description: "Ocorreu um erro ao finalizar seu pagamento.",
            variant: "destructive"
          });
        }
      };
      
      updateUserStatus();
      return;
    }

    if (isCanceled) {
      toast({
        title: "Pagamento cancelado",
        description: "Você pode tentar novamente quando quiser.",
        variant: "destructive"
      });
    }

    // If no user, redirect to registration
    if (!user) {
      toast({
        title: "Acesso restrito",
        description: "Você precisa estar registrado para acessar esta página",
        variant: "destructive"
      });
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
          .maybeSingle();
          
        if (userError && userError.code !== 'PGRST116') {
          console.error("Error fetching user data:", userError);
          throw userError;
        }

        // Redirect non-students away
        if (userData && userData.role !== 'student') {
          toast({
            title: "Acesso restrito",
            description: "Apenas estudantes podem realizar pagamentos de cursos."
          });
          navigate("/");
          return;
        }
        
        // Redirect already active students
        if (userData?.is_active) {
          toast({
            title: "Conta já ativa",
            description: "Sua conta já está ativa. Redirecionando para a área de alunos."
          });
          navigate("/student/dashboard");
          return;
        }
          
        // Check if student application is complete
        const { data: applicationData, error: applicationError } = await supabase
          .from("student_applications")
          .select("status")
          .eq("user_id", user.id)
          .maybeSingle();

        if (applicationError && applicationError.code !== 'PGRST116') {
          console.error("Error checking student application:", applicationError);
        }
        
        // If application doesn't exist or is pending, redirect to enrollment
        if (!applicationData || applicationData.status !== 'completed') {
          toast({
            title: "Cadastro incompleto",
            description: "Por favor, complete seu cadastro antes de prosseguir"
          });
          navigate("/inscricao");
          return;
        }
        
        // Check if profile exists and is complete
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("is_profile_complete")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error checking user profile:", profileError);
        }

        if (!profileData?.is_profile_complete) {
          toast({
            title: "Perfil incompleto",
            description: "Por favor, complete seu perfil antes de prosseguir"
          });
          navigate("/inscricao");
          return;
        }

        setIsProfileComplete(true);
      } catch (error) {
        console.error("Error checking user status:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao verificar o status do usuário",
          variant: "destructive"
        });
      }
    };

    if (user) {
      checkUserStatus();
    } else {
      toast({
        title: "Acesso restrito",
        description: "Você precisa estar logado para acessar esta página"
      });
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
      toast({
        title: "Acesso restrito",
        description: "Você precisa estar registrado para completar a compra"
      });
      navigate("/register");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Get application ID if available
      const { data: applicationData, error: appError } = await supabase
        .from("student_applications")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (appError && appError.code !== 'PGRST116') {
        console.error("Error fetching application data:", appError);
      }
      
      const applicationId = applicationData?.id;

      // Process payment based on selected method
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          paymentMethod,
          cardData: (paymentMethod === "credit-full" || paymentMethod === "credit-installments") ? cardData : undefined,
          course: {
            ...course,
            paymentMethod
          },
          userId: user.id,
          applicationId
        }
      });
      
      if (error) throw new Error(error.message || "Ocorreu um erro ao processar o pagamento");
      
      // Redirect to Stripe Checkout or show success based on payment method
      if (data?.url) {
        // Store email data for checkout recovery
        localStorage.setItem('checkout_session', JSON.stringify({
          sessionId: data.id,
          email: user.email,
          course: course.title,
          amount: course.finalPrice,
          paymentMethod
        }));
        
        window.location.href = data.url;
        return;
      } else if (data?.success) {
        toast({
          title: "Pagamento iniciado",
          description: "Siga as instruções para completar o pagamento"
        });
        // For non-redirect methods like PIX or boleto
        if (data.pixCode) {
          // Handle PIX code display
          // Could redirect to a PIX instructions page
          navigate(`/payment/pix?code=${data.pixCode}`);
          return;
        } else if (data.boleto) {
          // Handle boleto URL
          navigate(`/payment/boleto?url=${data.boleto}`);
          return;
        }
      } else {
        throw new Error("URL de checkout não encontrada");
      }
    } catch (error: any) {
      console.error("Erro ao processar pagamento:", error);
      toast({
        title: "Erro no pagamento",
        description: error.message || "Ocorreu um erro ao processar o pagamento",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
