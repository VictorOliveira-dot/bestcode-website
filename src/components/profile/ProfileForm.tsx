
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProfileFormProps {
  profileData: {
    full_name: string;
    phone: string;
    document_id: string;
    address: string;
    birthdate: string;
    terms_accepted: boolean;
  };
  setProfileData: React.Dispatch<React.SetStateAction<{
    full_name: string;
    phone: string;
    document_id: string;
    address: string;
    birthdate: string;
    terms_accepted: boolean;
  }>>;
  handleSubmit: (data: any) => void;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

const ProfileForm = ({
  profileData,
  setProfileData,
  handleSubmit,
  isSubmitting,
  errors
}: ProfileFormProps) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setProfileData(prev => ({
      ...prev,
      terms_accepted: checked
    }));
  };
  
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(profileData);
  };

  const hasErrors = Object.values(errors).some(error => error);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name">Nome Completo*</Label>
        <Input
          id="full_name"
          name="full_name"
          placeholder="Seu nome completo"
          value={profileData.full_name}
          onChange={handleChange}
          className={errors.full_name ? "border-red-500" : ""}
          required
        />
        {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="birthdate">Data de Nascimento*</Label>
        <Input
          id="birthdate"
          name="birthdate"
          placeholder="DD/MM/AAAA"
          value={profileData.birthdate}
          onChange={handleChange}
          className={errors.birthdate ? "border-red-500" : ""}
          required
        />
        {errors.birthdate && <p className="text-sm text-red-500">{errors.birthdate}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="document_id">CPF (opcional)</Label>
        <Input
          id="document_id"
          name="document_id"
          placeholder="000.000.000-00"
          value={profileData.document_id}
          onChange={handleChange}
          className={errors.document_id ? "border-red-500" : ""}
        />
        {errors.document_id && <p className="text-sm text-red-500">{errors.document_id}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone*</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="(00) 00000-0000"
          value={profileData.phone}
          onChange={handleChange}
          className={errors.phone ? "border-red-500" : ""}
          required
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Endereço Completo*</Label>
        <Textarea
          id="address"
          name="address"
          placeholder="Rua, número, complemento, bairro, cidade, estado, CEP"
          value={profileData.address}
          onChange={handleChange}
          className={errors.address ? "border-red-500" : ""}
          required
        />
        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={profileData.terms_accepted}
          onCheckedChange={handleCheckboxChange}
          className={errors.terms_accepted ? "border-red-500" : ""}
        />
        <Label 
          htmlFor="terms" 
          className="text-sm text-gray-700 font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Concordo com os <a href="/terms" className="text-bestcode-600 hover:underline">termos de uso</a> e <a href="/privacy" className="text-bestcode-600 hover:underline">política de privacidade</a>*
        </Label>
      </div>
      {errors.terms_accepted && <p className="text-sm text-red-500">{errors.terms_accepted}</p>}

      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Por favor, corrija os erros indicados no formulário antes de continuar.
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        type="submit" 
        className="w-full bg-bestcode-600 hover:bg-bestcode-700" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando..." : "Continuar para pagamento"}
      </Button>

      <p className="text-sm text-gray-500 text-center">* Campo obrigatório</p>
    </form>
  );
};

export default ProfileForm;
