import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import ProfileForm from "@/components/profile/ProfileForm";

const Inscricao = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
    document_id: "",
    address: "",
    birthdate: "",
    terms_accepted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // If not logged in, redirect to login
    if (!user) {
      toast.error("Você precisa estar logado para acessar esta página");
      navigate("/login");
      return;
    }

    // Fetch existing profile data if available
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          // If profile is already complete, go to checkout
          if (data.is_profile_complete) {
            // Check if user is already active
            const { data: userData } = await supabase
              .from("users")
              .select("role, is_active")
              .eq("id", user.id)
              .single();

            // If user is already active, go to enrollment
            if (userData?.is_active) {
              navigate("/enrollment");
              return;
            }
            
            navigate("/checkout");
            return;
          }

          // Otherwise, populate form with existing data
          setProfileData({
            full_name: data.full_name || "",
            phone: data.phone || "",
            document_id: data.document_id || "",
            address: data.address || "",
            birthdate: data.birthdate || "",
            terms_accepted: false, // Always require explicit acceptance
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Erro ao carregar dados do perfil");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate full name
    if (!profileData.full_name.trim()) {
      newErrors.full_name = "Nome completo é obrigatório";
    } else if (profileData.full_name.trim().length < 5) {
      newErrors.full_name = "Nome completo deve ter pelo menos 5 caracteres";
    }

    // Validate birthdate
    const birthdatePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!profileData.birthdate) {
      newErrors.birthdate = "Data de nascimento é obrigatória";
    } else if (!birthdatePattern.test(profileData.birthdate)) {
      newErrors.birthdate = "Data de nascimento deve estar no formato DD/MM/AAAA";
    } else {
      // Validate if it's a valid date
      const [day, month, year] = profileData.birthdate.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      const today = new Date();
      
      if (
        date.getDate() !== day ||
        date.getMonth() + 1 !== month ||
        date.getFullYear() !== year ||
        date > today
      ) {
        newErrors.birthdate = "Data de nascimento inválida";
      } else {
        // Check if user is at least 18 years old
        const age = today.getFullYear() - date.getFullYear();
        const m = today.getMonth() - date.getMonth();
        
        if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
          if (age - 1 < 18) {
            newErrors.birthdate = "Você deve ter pelo menos 18 anos";
          }
        } else if (age < 18) {
          newErrors.birthdate = "Você deve ter pelo menos 18 anos";
        }
      }
    }

    // Validate phone
    const phonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!profileData.phone) {
      newErrors.phone = "Telefone é obrigatório";
    } else if (!phonePattern.test(profileData.phone)) {
      newErrors.phone = "Telefone deve estar no formato (00) 00000-0000";
    }

    // Validate CPF if provided
    if (profileData.document_id) {
      const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      if (!cpfPattern.test(profileData.document_id)) {
        newErrors.document_id = "CPF deve estar no formato 000.000.000-00";
      }
    }

    // Validate address
    if (!profileData.address.trim()) {
      newErrors.address = "Endereço é obrigatório";
    } else if (profileData.address.trim().length < 10) {
      newErrors.address = "Endereço deve ser completo";
    }

    // Validate terms acceptance
    if (!profileData.terms_accepted) {
      newErrors.terms_accepted = "Você deve aceitar os termos de uso e política de privacidade";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (formData: any) => {
    if (!user) return;
    
    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Update the user profile
      const { error } = await supabase
        .from("user_profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          document_id: formData.document_id, 
          address: formData.address,
          birthdate: formData.birthdate,
          is_profile_complete: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso");
      
      // Redirect to checkout page
      navigate("/checkout");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom max-w-3xl">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Complete sua inscrição</CardTitle>
                <p className="text-gray-600">
                  Por favor, complete suas informações antes de prosseguir para o pagamento
                </p>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bestcode-600"></div>
                  </div>
                ) : (
                  <ProfileForm 
                    profileData={profileData} 
                    setProfileData={setProfileData} 
                    handleSubmit={handleProfileSubmit} 
                    isSubmitting={isLoading}
                    errors={errors}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Inscricao;
