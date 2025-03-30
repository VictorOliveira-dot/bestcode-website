
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnrollmentProgressBar from "@/components/enrollment/EnrollmentProgressBar";
import EnrollmentForm from "@/components/enrollment/EnrollmentForm";
import { toast } from "sonner";

const ENROLLMENT_STORAGE_KEY = 'enrollment_form_data';

const Enrollment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 3;
  
  // Check localStorage for saved data and determine starting step
  useEffect(() => {
    const savedData = localStorage.getItem(ENROLLMENT_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // If user has completed personal info, start at step 2
        if (parsedData.firstName && parsedData.lastName && parsedData.cpf && parsedData.phone) {
          setCurrentStep(2);
          // If user has also uploaded documents, start at step 3
          if (parsedData.education || parsedData.professionalArea) {
            setCurrentStep(3);
          }
        }
      } catch (error) {
        console.error("Error parsing saved enrollment data:", error);
      }
    }
  }, []);
  
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
