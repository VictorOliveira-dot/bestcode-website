
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnrollmentProgressBar from "@/components/enrollment/EnrollmentProgressBar";
import EnrollmentForm from "@/components/enrollment/EnrollmentForm";

const Enrollment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 3;
  
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
