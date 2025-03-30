
import React, { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PersonalInfoStep from "./PersonalInfoStep";
import DocumentationStep from "./DocumentationStep";
import StudyPreferencesStep from "./StudyPreferencesStep";
import EnrollmentFormNav from "./EnrollmentFormNav";

interface EnrollmentFormProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  currentStep,
  totalSteps,
  isSubmitting,
  goToNextStep,
  goToPreviousStep,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    cpf: "",
    phone: "",
    whatsapp: "",
    address: "",
    education: "",
    professionalArea: "",
    experienceLevel: "",
    studyAvailability: "",
    goals: "",
    referral: ""
  });
  
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For the final step, validate required fields
    if (currentStep === totalSteps) {
      // Check if required fields for the last step are filled
      const requiredStep3Fields = ['education', 'professionalArea', 'experienceLevel', 'studyAvailability'];
      const missingFields = requiredStep3Fields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }
      
      // Simulate form submission
      setTimeout(() => {
        // Redirect to student dashboard would happen here
        window.location.href = "/student/dashboard";
      }, 2000);
    } else {
      // If not the final step, just go to the next step
      goToNextStep();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {currentStep === 1 && "Informações Pessoais"}
          {currentStep === 2 && "Documentação"}
          {currentStep === 3 && "Preferências de Estudo"}
        </CardTitle>
        <CardDescription>
          {currentStep === 1 && "Preencha seus dados pessoais"}
          {currentStep === 2 && "Envie os documentos necessários"}
          {currentStep === 3 && "Configure suas preferências de estudo"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <PersonalInfoStep 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
          )}

          {/* Step 2: Documentation */}
          {currentStep === 2 && (
            <DocumentationStep />
          )}

          {/* Step 3: Study Preferences */}
          {currentStep === 3 && (
            <StudyPreferencesStep 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
          )}

          <EnrollmentFormNav 
            currentStep={currentStep}
            totalSteps={totalSteps}
            isSubmitting={isSubmitting}
            goToPreviousStep={goToPreviousStep}
            goToNextStep={goToNextStep}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default EnrollmentForm;
