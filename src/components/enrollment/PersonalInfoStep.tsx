
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validateCPF, validateDateOfBirth, validateBrazilianPhone } from "@/utils/validationUtils";

interface PersonalInfoStepProps {
  formData: {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    cpf: string;
    phone: string;
    whatsapp: string;
    address: string;
  };
  handleInputChange: (field: string, value: any) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  handleInputChange,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'cpf':
        return !value.trim() 
          ? "CPF é obrigatório" 
          : !validateCPF(value) 
            ? "CPF inválido" 
            : "";
      case 'birthDate':
        return !value.trim() 
          ? "Data de nascimento é obrigatória" 
          : !validateDateOfBirth(value) 
            ? "Data de nascimento inválida ou não está em formato DD/MM/AAAA" 
            : "";
      case 'phone':
        return !value.trim() 
          ? "Telefone é obrigatório" 
          : !validateBrazilianPhone(value) 
            ? "Telefone inválido, use o formato (XX) XXXXX-XXXX" 
            : "";
      case 'whatsapp':
        return value.trim() && !validateBrazilianPhone(value)
          ? "WhatsApp inválido, use o formato (XX) XXXXX-XXXX ou deixe em branco" 
          : "";
      case 'firstName':
        return !value.trim() ? "Nome é obrigatório" : "";
      case 'lastName':
        return !value.trim() ? "Sobrenome é obrigatório" : "";
      case 'address':
        return !value.trim() ? "Endereço é obrigatório" : "";
      default:
        return "";
    }
  };

  const handleChange = (field: string, value: any) => {
    handleInputChange(field, value);
    
    // Validate the field and update errors
    const errorMessage = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">Nome</Label>
          <Input 
            id="first-name" 
            placeholder="Seu nome" 
            required 
            mask={/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/}
            value={formData.firstName}
            onAccept={(value) => handleChange('firstName', value)}
            onBlur={() => handleChange('firstName', formData.firstName)}
            className={errors.firstName ? "border-destructive" : ""}
          />
          {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Sobrenome</Label>
          <Input 
            id="last-name" 
            placeholder="Seu sobrenome" 
            required 
            mask={/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/}
            value={formData.lastName}
            onAccept={(value) => handleChange('lastName', value)}
            onBlur={() => handleChange('lastName', formData.lastName)}
            className={errors.lastName ? "border-destructive" : ""}
          />
          {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birth-date">Data de Nascimento</Label>
          <Input 
            id="birth-date" 
            type="text" 
            placeholder="DD/MM/AAAA"
            required 
            mask="00/00/0000"
            value={formData.birthDate}
            onAccept={(value) => handleChange('birthDate', value)}
            onBlur={() => handleChange('birthDate', formData.birthDate)}
            className={errors.birthDate ? "border-destructive" : ""}
          />
          {errors.birthDate && <p className="text-sm text-destructive">{errors.birthDate}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gênero</Label>
          <Select onValueChange={(value) => handleChange('gender', value)}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Masculino</SelectItem>
              <SelectItem value="female">Feminino</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefiro não dizer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input 
          id="cpf" 
          placeholder="000.000.000-00" 
          required 
          mask="000.000.000-00"
          value={formData.cpf}
          onAccept={(value) => handleChange('cpf', value)}
          onBlur={() => handleChange('cpf', formData.cpf)}
          className={errors.cpf ? "border-destructive" : ""}
        />
        {errors.cpf && <p className="text-sm text-destructive">{errors.cpf}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input 
            id="phone" 
            placeholder="(00) 00000-0000" 
            required 
            mask="(00) 00000-0000"
            value={formData.phone}
            onAccept={(value) => handleChange('phone', value)}
            onBlur={() => handleChange('phone', formData.phone)}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input 
            id="whatsapp" 
            placeholder="(00) 00000-0000" 
            mask="(00) 00000-0000"
            value={formData.whatsapp}
            onAccept={(value) => handleChange('whatsapp', value)}
            onBlur={() => handleChange('whatsapp', formData.whatsapp)}
            className={errors.whatsapp ? "border-destructive" : ""}
          />
          {errors.whatsapp && <p className="text-sm text-destructive">{errors.whatsapp}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Endereço Completo</Label>
        <Textarea 
          id="address" 
          placeholder="Rua, número, complemento, bairro, cidade, estado, CEP" 
          required 
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          onBlur={() => handleChange('address', formData.address)}
          className={errors.address ? "border-destructive" : ""}
        />
        {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
      </div>

      {Object.values(errors).some(error => error) && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Por favor, corrija os erros no formulário antes de continuar.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PersonalInfoStep;
