
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PersonalInfoStep from "./PersonalInfoStep";
import StudyPreferencesStep from "./StudyPreferencesStep";
import EnrollmentFormNav from "./EnrollmentFormNav";
import { validateCPF, validateDateOfBirth, validateBrazilianPhone } from "@/utils/validationUtils";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

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
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
    const requiredStep2Fields = ['education', 'professionalArea', 'experienceLevel', 'studyAvailability'];
    const missingFields = requiredStep2Fields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return false;
    }
    
    return true;
  };

  const saveProfileToSupabase = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para salvar seu perfil");
      return false;
    }

    try {
      setSaving(true);
      
      // Prepare birth date in YYYY-MM-DD format for database
      const [day, month, year] = formData.birthDate.split('/');
      const formattedBirthDate = `${year}-${month}-${day}`;
      
      // 1. Save to user_profiles table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          birth_date: formattedBirthDate,
          gender: formData.gender,
          cpf: formData.cpf,
          phone: formData.phone,
          whatsapp: formData.whatsapp || null,
          address: formData.address,
          education: formData.education,
          professional_area: formData.professionalArea,
          experience_level: formData.experienceLevel,
          study_availability: formData.studyAvailability,
          goals: formData.goals || null,
          referral: formData.referral || null,
          is_profile_complete: true,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;
      
      // 2. Save to student_applications table
      const { error: applicationError } = await supabase
        .from('student_applications')
        .insert({
          user_id: user.id,
          full_name: `${formData.firstName} ${formData.lastName}`,
          email: user.email,
          phone: formData.phone,
          course: 'Formação Completa em QA', // Default course or could be made dynamic
          status: 'pending'
        });

      if (applicationError) throw applicationError;
      
      return true;
    } catch (error: any) {
      console.error("Error saving profile to Supabase:", error);
      toast.error(`Erro ao salvar perfil: ${error.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
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
      // Save to Supabase
      const saveSuccess = await saveProfileToSupabase();
      
      if (saveSuccess) {
        // Clear saved data after successful submission
        localStorage.removeItem(ENROLLMENT_STORAGE_KEY);
        
        toast.success("Perfil salvo com sucesso! Redirecionando para o checkout...");
        
        // Redirect to checkout
        setTimeout(() => {
          navigate("/checkout");
        }, 1500);
      }
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
          {currentStep === 2 && "Preferências de Estudo"}
        </CardTitle>
        <CardDescription>
          {currentStep === 1 && "Preencha seus dados pessoais"}
          {currentStep === 2 && "Configure suas preferências de estudo"}
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

          {/* Step 2: Study Preferences (was Step 3 before) */}
          {currentStep === 2 && (
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
            isSubmitting={saving || isSubmitting}
            goToPreviousStep={goToPreviousStep}
            onNextClick={handleSubmit}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default EnrollmentForm;
