
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudyPreferencesStepProps {
  formData: {
    education: string;
    professionalArea: string;
    experienceLevel: string;
    studyAvailability: string;
    goals: string;
    referral: string;
  };
  handleInputChange: (field: string, value: any) => void;
}

const StudyPreferencesStep: React.FC<StudyPreferencesStepProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="education">Nível de escolaridade</Label>
        <Select onValueChange={(value) => handleInputChange('education', value)}>
          <SelectTrigger id="education">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high-school">Ensino Médio</SelectItem>
            <SelectItem value="technical">Ensino Técnico</SelectItem>
            <SelectItem value="bachelor">Ensino Superior</SelectItem>
            <SelectItem value="specialization">Especialização</SelectItem>
            <SelectItem value="master">Mestrado</SelectItem>
            <SelectItem value="doctorate">Doutorado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="professional-area">Área profissional atual</Label>
        <Select onValueChange={(value) => handleInputChange('professionalArea', value)}>
          <SelectTrigger id="professional-area">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technology">Tecnologia</SelectItem>
            <SelectItem value="education">Educação</SelectItem>
            <SelectItem value="healthcare">Saúde</SelectItem>
            <SelectItem value="finance">Finanças</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="other">Outra</SelectItem>
            <SelectItem value="student">Estudante</SelectItem>
            <SelectItem value="unemployed">Em transição de carreira</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="experience-level">Experiência com QA</Label>
        <Select onValueChange={(value) => handleInputChange('experienceLevel', value)}>
          <SelectTrigger id="experience-level">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhuma experiência</SelectItem>
            <SelectItem value="beginner">Iniciante (menos de 1 ano)</SelectItem>
            <SelectItem value="intermediate">Intermediário (1-3 anos)</SelectItem>
            <SelectItem value="advanced">Avançado (3+ anos)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="study-availability">Disponibilidade para estudo</Label>
        <Select onValueChange={(value) => handleInputChange('studyAvailability', value)}>
          <SelectTrigger id="study-availability">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="up-to-5h">Até 5h semanais</SelectItem>
            <SelectItem value="5-10h">5-10h semanais</SelectItem>
            <SelectItem value="10-20h">10-20h semanais</SelectItem>
            <SelectItem value="more-than-20h">Mais de 20h semanais</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="goals">Seus objetivos com o curso</Label>
        <Textarea 
          id="goals" 
          placeholder="Conte-nos quais são seus objetivos ao fazer este curso"
          rows={4}
          value={formData.goals}
          onChange={(e) => handleInputChange('goals', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="referral">Como conheceu a BestCode?</Label>
        <Select onValueChange={(value) => handleInputChange('referral', value)}>
          <SelectTrigger id="referral">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="search">Busca na internet</SelectItem>
            <SelectItem value="social">Redes sociais</SelectItem>
            <SelectItem value="friend">Indicação de amigo</SelectItem>
            <SelectItem value="ad">Anúncio</SelectItem>
            <SelectItem value="other">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StudyPreferencesStep;
