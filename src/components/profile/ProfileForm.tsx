
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ProfileFormProps {
  profileData: {
    full_name: string;
    phone: string;
    document_id: string;
    address: string;
  };
  setProfileData: React.Dispatch<React.SetStateAction<{
    full_name: string;
    phone: string;
    document_id: string;
    address: string;
  }>>;
  handleSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const ProfileForm = ({
  profileData,
  setProfileData,
  handleSubmit,
  isSubmitting
}: ProfileFormProps) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(profileData);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name">Nome Completo</Label>
        <Input
          id="full_name"
          name="full_name"
          placeholder="Seu nome completo"
          value={profileData.full_name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="document_id">CPF</Label>
        <Input
          id="document_id"
          name="document_id"
          placeholder="000.000.000-00"
          value={profileData.document_id}
          onChange={handleChange}
          mask="000.000.000-00"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="(00) 00000-0000"
          value={profileData.phone}
          onChange={handleChange}
          mask="(00) 00000-0000"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Endereço Completo</Label>
        <Textarea
          id="address"
          name="address"
          placeholder="Rua, número, complemento, bairro, cidade, estado, CEP"
          value={profileData.address}
          onChange={handleChange}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-bestcode-600 hover:bg-bestcode-700" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando..." : "Continuar para pagamento"}
      </Button>
    </form>
  );
};

export default ProfileForm;
