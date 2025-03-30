
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PersonalInfoStep from "./PersonalInfoStep";
import DocumentationStep from "./DocumentationStep";
import StudyPreferencesStep from "./StudyPreferencesStep";
import EnrollmentFormNav from "./EnrollmentFormNav";
import { validateCPF, validateDateOfBirth, validateBrazilianPhone } from "@/utils/validationUtils";
import { Button } from "../ui/button";
import { Save } from "lucide-react";

interface EnrollmentFormProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const ENROLLMENT_STORAGE_KEY = 'enrollment_form_data';

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
  
  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(ENROLLMENT_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        toast.info("Dados do seu formulário foram carregados", {
          description: "Continue de onde você parou"
        });
      } catch (error) {
        console.error("Error parsing saved enrollment data:", error);
      }
    }
  }, []);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (Object.values(formData).some(value => value !== "")) {
      localStorage.setItem(ENROLLMENT_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);
  
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
      
      // Clear saved data after successful submission
      localStorage.removeItem(ENROLLMENT_STORAGE_KEY);
      
      setTimeout(() => {
        // Redirect to student dashboard would happen here
        window.location.href = "/student/dashboard";
      }, 2000);
    } else {
      // If not the final step, just go to the next step
      goToNextStep();
    }
  };
  
  const handleSaveProgress = () => {
    localStorage.setItem(ENROLLMENT_STORAGE_KEY, JSON.stringify(formData));
    toast.success("Progresso salvo com sucesso!", {
      description: "Você pode continuar mais tarde usando este dispositivo"
    });
  };
  
  const handleClearProgress = () => {
    if (window.confirm("Tem certeza que deseja limpar todo o progresso? Esta ação não pode ser desfeita.")) {
      localStorage.removeItem(ENROLLMENT_STORAGE_KEY);
      setFormData({
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
      toast.info("Progresso removido", {
        description: "Todos os dados do formulário foram apagados"
      });
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

          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClearProgress}
              className="text-destructive hover:text-destructive"
            >
              Limpar Dados
            </Button>
            
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleSaveProgress}
              className="flex items-center"
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar Progresso
            </Button>
          </div>

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
