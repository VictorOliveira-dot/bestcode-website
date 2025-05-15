
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
  
  // Load existing data from the database upon component mount
  useEffect(() => {
    if (!user) return;
    
    const loadUserProfile = async () => {
      try {
        // Check for existing profile data
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching user profile:", profileError);
          return;
        }
        
        if (profileData) {
          console.log("Loaded existing profile data", profileData);
          
          // Format date from YYYY-MM-DD to DD/MM/YYYY if it exists
          let formattedBirthDate = '';
          if (profileData.birth_date) {
            const dateParts = new Date(profileData.birth_date)
              .toISOString()
              .slice(0, 10)
              .split('-');
            formattedBirthDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
          }
          
          setFormData({
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            birthDate: formattedBirthDate,
            gender: profileData.gender || '',
            cpf: profileData.cpf || '',
            phone: profileData.phone || '',
            whatsapp: profileData.whatsapp || '',
            address: profileData.address || '',
            education: profileData.education || '',
            professionalArea: profileData.professional_area || '',
            experienceLevel: profileData.experience_level || '',
            studyAvailability: profileData.study_availability || '',
            goals: profileData.goals || '',
            referral: profileData.referral || ''
          });
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    };
    
    loadUserProfile();
  }, [user]);
  
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
      
      // 2. Check if application already exists
      const { data: existingApp, error: checkError } = await supabase
        .from('student_applications')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      let applicationId;
      
      if (existingApp) {
        // Update existing application
        applicationId = existingApp.id;
        const { error: updateError } = await supabase
          .from('student_applications')
          .update({
            full_name: `${formData.firstName} ${formData.lastName}`,
            email: user.email,
            phone: formData.phone,
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', applicationId);
          
        if (updateError) throw updateError;
      } else {
        // Create new application
        const { data: newApp, error: applicationError } = await supabase
          .from('student_applications')
          .insert({
            user_id: user.id,
            full_name: `${formData.firstName} ${formData.lastName}`,
            email: user.email,
            phone: formData.phone,
            course: 'Formação Completa em QA', // Default course or could be made dynamic
            status: 'completed'
          })
          .select()
          .single();

        if (applicationError) throw applicationError;
        applicationId = newApp.id;
      }
      
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
  
  const handleSaveProgress = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para salvar seu progresso");
      return;
    }
    
    try {
      setSaving(true);
      
      // Save the current progress to the database with pending status
      // Prepare birth date in YYYY-MM-DD format for database if it exists
      let formattedBirthDate = null;
      if (formData.birthDate) {
        const [day, month, year] = formData.birthDate.split('/');
        formattedBirthDate = `${year}-${month}-${day}`;
      }
      
      // Save partial data to user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          first_name: formData.firstName || null,
          last_name: formData.lastName || null,
          birth_date: formattedBirthDate,
          gender: formData.gender || null,
          cpf: formData.cpf || null,
          phone: formData.phone || null,
          whatsapp: formData.whatsapp || null,
          address: formData.address || null,
          education: formData.education || null,
          professional_area: formData.professionalArea || null,
          experience_level: formData.experienceLevel || null,
          study_availability: formData.studyAvailability || null,
          goals: formData.goals || null,
          referral: formData.referral || null,
          is_profile_complete: false,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;
      
      // Check if student application exists
      const { data: existingApp, error: checkError } = await supabase
        .from('student_applications')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      // Save or update application with pending status
      if (existingApp) {
        const { error: updateError } = await supabase
          .from('student_applications')
          .update({
            full_name: formData.firstName && formData.lastName ? 
              `${formData.firstName} ${formData.lastName}` : null,
            phone: formData.phone || null,
            status: 'pending',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingApp.id);
          
        if (updateError) throw updateError;
      } else if (formData.firstName || formData.lastName || formData.phone) {
        // Only create application if we have at least some basic info
        const { error: createError } = await supabase
          .from('student_applications')
          .insert({
            user_id: user.id,
            full_name: formData.firstName && formData.lastName ? 
              `${formData.firstName} ${formData.lastName}` : user.name,
            email: user.email,
            phone: formData.phone || null,
            course: 'Formação Completa em QA',
            status: 'pending'
          });
          
        if (createError) throw createError;
      }
      
      toast.success("Progresso salvo com sucesso!", {
        description: "Você pode continuar mais tarde"
      });
    } catch (error: any) {
      console.error("Error saving progress:", error);
      toast.error(`Erro ao salvar progresso: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };
  
  const handleClearProgress = async () => {
    if (window.confirm("Tem certeza que deseja limpar todo o progresso? Esta ação não pode ser desfeita.")) {
      try {
        setSaving(true);
        
        if (user) {
          // Delete application if exists
          await supabase
            .from('student_applications')
            .delete()
            .eq('user_id', user.id);
            
          // Reset profile data
          await supabase
            .from('user_profiles')
            .update({
              first_name: null,
              last_name: null,
              birth_date: null,
              gender: null,
              cpf: null,
              phone: null,
              whatsapp: null,
              address: null,
              education: null,
              professional_area: null,
              experience_level: null,
              study_availability: null,
              goals: null,
              referral: null,
              is_profile_complete: false,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);
        }
        
        // Reset form state
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
      } catch (error: any) {
        console.error("Error clearing progress:", error);
        toast.error(`Erro ao limpar progresso: ${error.message}`);
      } finally {
        setSaving(false);
      }
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

          {/* Step 2: Study Preferences */}
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
              disabled={saving}
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Salvando..." : "Salvar Progresso"}
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
