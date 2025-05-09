
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnrollmentProgressBar from "@/components/enrollment/EnrollmentProgressBar";
import EnrollmentForm from "@/components/enrollment/EnrollmentForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

const ENROLLMENT_STORAGE_KEY = 'enrollment_form_data';

const Enrollment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const totalSteps = 2; // Changed from 3 to 2
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check for existing profile data in Supabase and localStorage
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Check if profile exists and is complete in Supabase
        const { data: profileData, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          throw error;
        }
        
        // If profile is complete, redirect to checkout
        if (profileData?.is_profile_complete) {
          toast.info("Seu perfil já está completo. Redirecionando para o checkout...");
          navigate('/checkout');
          return;
        }
        
        // Otherwise, continue with loading saved form data if available
        const savedData = localStorage.getItem(ENROLLMENT_STORAGE_KEY);
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            // If user has completed personal info, start at step 2
            if (parsedData.firstName && parsedData.lastName && parsedData.cpf && parsedData.phone) {
              setCurrentStep(2);
            }
          } catch (error) {
            console.error("Error parsing saved enrollment data:", error);
          }
        }
        
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Erro ao carregar dados do perfil");
      } finally {
        setIsLoading(false);
      }
    };

    // Pequeno delay para garantir que o estado de autenticação esteja atualizado
    const timer = setTimeout(() => {
      fetchProfileData();
    }, 500);

    return () => clearTimeout(timer);
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
    if (!user && !isLoading) {
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
            {localStorage.getItem(ENROLLMENT_STORAGE_KEY) && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-md mt-2">
                Você tem dados salvos. Continue de onde parou.
              </div>
            )}
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
