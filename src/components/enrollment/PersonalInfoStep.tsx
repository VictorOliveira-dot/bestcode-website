
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
            onAccept={(value) => handleInputChange('firstName', value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Sobrenome</Label>
          <Input 
            id="last-name" 
            placeholder="Seu sobrenome" 
            required 
            mask={/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/}
            value={formData.lastName}
            onAccept={(value) => handleInputChange('lastName', value)}
          />
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
            onAccept={(value) => handleInputChange('birthDate', value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gênero</Label>
          <Select onValueChange={(value) => handleInputChange('gender', value)}>
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
          onAccept={(value) => handleInputChange('cpf', value)}
        />
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
            onAccept={(value) => handleInputChange('phone', value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input 
            id="whatsapp" 
            placeholder="(00) 00000-0000" 
            mask="(00) 00000-0000"
            value={formData.whatsapp}
            onAccept={(value) => handleInputChange('whatsapp', value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Endereço Completo</Label>
        <Textarea 
          id="address" 
          placeholder="Rua, número, complemento, bairro, cidade, estado, CEP" 
          required 
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
      </div>
    </div>
  );
};

export default PersonalInfoStep;
