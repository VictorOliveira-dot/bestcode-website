import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import ProfileForm from "@/components/profile/ProfileForm";

const ProfileCompletion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
    document_id: "",
    address: "",
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // If not logged in, redirect to login
    if (!user) {
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
            navigate("/checkout");
            return;
          }

          // Otherwise, populate form with existing data
          setProfileData({
            full_name: data.full_name || "",
            phone: data.phone || "",
            document_id: data.document_id || "",
            address: data.address || "",
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

  const handleProfileSubmit = async (formData: any) => {
    if (!user) return;
    
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
          is_profile_complete: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso");
      
      // Redirect to checkout page
      navigate("/checkout");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Complete seu perfil</CardTitle>
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
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileCompletion;
