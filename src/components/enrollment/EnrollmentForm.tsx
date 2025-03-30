
import React, { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PersonalInfoStep from "./PersonalInfoStep";
import DocumentationStep from "./DocumentationStep";
import StudyPreferencesStep from "./StudyPreferencesStep";
import EnrollmentFormNav from "./EnrollmentFormNav";
import { validateCPF, validateDateOfBirth, validateBrazilianPhone } from "@/utils/validationUtils";

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
  
  const validatePersonalInfo = () => {
    // Required fields for step 1
    const requiredFields = ['firstName', 'lastName', 'birthDate', 'cpf', 'phone', 'address'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return false;
    }
    
    // Validate CPF
    if (!validateCPF(formData.cpf)) {
      toast.error("CPF inválido. Por favor, verifique.");
      return false;
    }
    
    // Validate birthDate
    if (!validateDateOfBirth(formData.birthDate)) {
      toast.error("Data de nascimento inválida. Use o formato DD/MM/AAAA.");
      return false;
    }
    
    // Validate phone
    if (!validateBrazilianPhone(formData.phone)) {
      toast.error("Telefone inválido. Use o formato (XX) XXXXX-XXXX.");
      return false;
    }
    
    // Validate whatsapp if provided
    if (formData.whatsapp && !validateBrazilianPhone(formData.whatsapp)) {
      toast.error("WhatsApp inválido. Use o formato (XX) XXXXX-XXXX.");
      return false;
    }
    
    return true;
  };
  
  const validateStudyPreferences = () => {
    // Check if required fields for the last step are filled
    const requiredStep3Fields = ['education', 'professionalArea', 'experienceLevel', 'studyAvailability'];
    const missingFields = requiredStep3Fields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate current step
    let isValid = true;
    
    if (currentStep === 1) {
      isValid = validatePersonalInfo();
    } else if (currentStep === totalSteps) {
      isValid = validateStudyPreferences();
    }
    
    if (!isValid) return;
    
    // For the final step, submit the form
    if (currentStep === totalSteps) {
      // Simulate form submission
      toast.success("Matrícula enviada com sucesso!");
      
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
            onNextClick={handleSubmit}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default EnrollmentForm;
