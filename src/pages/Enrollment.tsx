
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnrollmentProgressBar from "@/components/enrollment/EnrollmentProgressBar";
import EnrollmentForm from "@/components/enrollment/EnrollmentForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

const Enrollment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const totalSteps = 2;
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check for existing profile data and application status in Supabase
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        console.log("Enrollment page - checking user status:", {
          user_id: user.id,
          role: user.role,
          is_active: user.is_active
        });

        // Se o usuário é estudante e já está ativo, redirecionar para o dashboard
        if (user.role === 'student' && user.is_active) {
          console.log("Student is already active, redirecting to dashboard");
          toast.info("Sua conta já está ativa. Redirecionando para o dashboard...");
          navigate('/student/dashboard');
          return;
        }
        
        // Check if user has an application and its status
        const { data: applicationData, error: applicationError } = await supabase
          .from('student_applications')
          .select('status')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (applicationError && applicationError.code !== 'PGRST116') {
          console.error("Error checking application status:", applicationError);
        }
        
        // If application exists and is completed/approved, redirect to checkout
        if (applicationData && ['completed', 'approved'].includes(applicationData.status)) {
          toast.info("Sua inscrição já está completa. Redirecionando para o checkout...");
          navigate('/checkout');
          return;
        }
        
        // Check if profile exists and is complete
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('is_profile_complete')
          .eq('id', user.id)
          .maybeSingle();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error checking profile status:", profileError);
        }
        
        // If profile is complete but user hasn't paid, redirect to checkout
        if (profileData?.is_profile_complete && !user.is_active) {
          toast.info("Seu perfil está completo. Redirecionando para o checkout...");
          navigate('/checkout');
          return;
        }
        
      } catch (error) {
        console.error("Error checking application status:", error);
        toast.error("Erro ao verificar status da inscrição");
      } finally {
        setIsLoading(false);
      }
    };

    checkApplicationStatus();
  }, [user, navigate]);
  
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // If user is not logged in, redirect to login
  useEffect(() => {
    console.log("Enrollment page auth state:", { user, isLoading });
    
    if (!user && !isLoading) {
      console.log("Redirecting to login from enrollment page");
      toast.error("Você precisa estar logado para acessar esta página");
      navigate('/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bestcode-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Matrícula</h1>
            <p className="text-gray-600 mt-1">Complete seu cadastro para iniciar o curso</p>
          </div>

          <EnrollmentProgressBar 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
          />

          <EnrollmentForm 
            currentStep={currentStep}
            totalSteps={totalSteps}
            isSubmitting={isSubmitting}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Enrollment;
