
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
import { AlertTriangle } from "lucide-react";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [checkingActivation, setCheckingActivation] = useState(false);
  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  
  const isCanceled = new URLSearchParams(location.search).get("canceled") === "true";
  const isSuccess = new URLSearchParams(location.search).get("success") === "true";

  // Course information with dynamic pricing
  const [course, setCourse] = useState({
    title: "Formação Completa em QA",
    price: 4999.00,
    discount: 999.00,
    finalPrice: 4000.00,
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
        finalPrice: 4499.00
      }));
    }
  }, [paymentMethod]);

  // Check user activation status with retry mechanism
  const checkUserActivation = async (retries = 5, delay = 2000) => {
    if (!user) return false;
    
    setCheckingActivation(true);
    
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Verificando ativação (tentativa ${i + 1}/${retries})`);
        
        const { data: userData, error } = await supabase
          .from('users')
          .select('is_active, role')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error("Erro ao verificar status do usuário:", error);
          if (i === retries - 1) throw error;
        } else if (userData?.is_active) {
          console.log("Usuário ativado com sucesso!");
          
          // Update the user in auth context
          const updatedUser = { ...user, is_active: true };
          setUser(updatedUser);
          
          setCheckingActivation(false);
          return true;
        }
        
        // Wait before next attempt
        if (i < retries - 1) {
          console.log(`Aguardando ${delay}ms antes da próxima verificação...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error(`Erro na tentativa ${i + 1}:`, error);
        if (i === retries - 1) {
          setCheckingActivation(false);
          throw error;
        }
      }
    }
    
    setCheckingActivation(false);
    return false;
  };

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      if (!isSuccess || !user) return;
      
      try {
        toast({
          title: "Pagamento processado!",
          description: "Verificando ativação da sua conta..."
        });
        
        const isActivated = await checkUserActivation();
        
        if (isActivated) {
          toast({
            title: "Conta ativada!",
            description: "Redirecionando para a área de alunos..."
          });
          
          setTimeout(() => {
            navigate("/student/dashboard");
          }, 2000);
        } else {
          toast({
            title: "Processamento em andamento",
            description: "Seu pagamento foi processado. A ativação pode levar alguns minutos. Você receberá uma notificação quando estiver pronto.",
            variant: "default"
          });
          
          setTimeout(() => {
            navigate("/student/dashboard");
          }, 3000);
        }
      } catch (error) {
        console.error("Erro ao processar sucesso do pagamento:", error);
        toast({
          title: "Pagamento processado",
          description: "Seu pagamento foi processado com sucesso. A ativação da conta pode levar alguns minutos.",
          variant: "default"
        });
        
        setTimeout(() => {
          navigate("/student/dashboard");
        }, 3000);
      }
    };

    if (isSuccess) {
      handlePaymentSuccess();
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

    // Check user status and profile completion
    const checkUserStatus = async () => {
      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("is_active, role")
          .eq("id", user.id)
          .maybeSingle();
          
        if (userError && userError.code !== 'PGRST116') {
          console.error("Error fetching user data:", userError);
          throw userError;
        }

        if (userData && userData.role !== 'student') {
          toast({
            title: "Acesso restrito",
            description: "Apenas estudantes podem realizar pagamentos de cursos."
          });
          navigate("/");
          return;
        }
        
        if (userData?.is_active) {
          toast({
            title: "Conta já ativa",
            description: "Sua conta já está ativa. Redirecionando para a área de alunos."
          });
          navigate("/student/dashboard");
          return;
        }
          
        const { data: applicationData, error: applicationError } = await supabase
          .from("student_applications")
          .select("status")
          .eq("user_id", user.id)
          .maybeSingle();

        if (applicationError && applicationError.code !== 'PGRST116') {
          console.error("Error checking student application:", applicationError);
        }
        
        if (!applicationData || applicationData.status !== 'completed') {
          toast({
            title: "Cadastro incompleto",
            description: "Por favor, complete seu cadastro antes de prosseguir"
          });
          navigate("/inscricao");
          return;
        }
        
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

    if (user && !isSuccess) {
      checkUserStatus();
    }
  }, [user, navigate, isCanceled, isSuccess, setUser]);

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
      const { data: applicationData, error: appError } = await supabase
        .from("student_applications")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (appError && appError.code !== 'PGRST116') {
        console.error("Error fetching application data:", appError);
      }
      
      const applicationId = applicationData?.id;

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
      
      if (data.testMode) {
        localStorage.setItem('payment_test_mode', 'true');
      }
      
      if (data?.url) {
        localStorage.setItem('checkout_session', JSON.stringify({
          sessionId: data.id,
          email: user.email,
          course: course.title,
          amount: course.finalPrice,
          paymentMethod,
          testMode: data.testMode
        }));
        
        window.location.href = data.url;
        return;
      } else if (data?.success) {
        toast({
          title: "Pagamento iniciado",
          description: "Siga as instruções para completar o pagamento"
        });
        
        if (data.pixCode) {
          navigate(`/payment/pix?code=${data.pixCode}`);
          return;
        } else if (data.boleto) {
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

  if (!isProfileComplete && user && !isSuccess) {
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

  if (checkingActivation) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bestcode-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Ativando sua conta...</h2>
            <p className="text-gray-600">Aguarde enquanto processamos sua ativação.</p>
          </div>
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
              <div className="lg:col-span-1 order-2 lg:order-1">
                <OrderSummary course={course} />
              </div>

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
