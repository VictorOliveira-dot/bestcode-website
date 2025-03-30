
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const Enrollment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  
  const totalSteps = 3;
  
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For the final step, validate required fields
    if (currentStep === totalSteps) {
      // Check if required fields for the last step are filled
      const requiredStep3Fields = ['education', 'professionalArea', 'experienceLevel', 'studyAvailability'];
      const missingFields = requiredStep3Fields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }
      
      setIsSubmitting(true);
      
      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false);
        // Redirect to student dashboard would happen here
        window.location.href = "/student/dashboard";
      }, 2000);
    } else {
      // If not the final step, just go to the next step
      goToNextStep();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Matrícula</h1>
            <p className="text-gray-600 mt-1">Complete seu cadastro para iniciar o curso</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">
                Etapa {currentStep} de {totalSteps}
              </div>
              <div className="text-sm text-gray-500">
                {currentStep === 1 && "Informações Pessoais"}
                {currentStep === 2 && "Documentação"}
                {currentStep === 3 && "Preferências de Estudo"}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-bestcode-600 h-2.5 rounded-full transition-all" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

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
                )}

                {/* Step 2: Documentation */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="id-upload">RG ou CNH (Frente)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-gray-400" />
                          <div className="text-sm font-medium">Arraste seu arquivo ou clique para fazer upload</div>
                          <div className="text-xs text-gray-500">Suportamos JPG, PNG ou PDF até 5MB</div>
                          <Input id="id-upload" type="file" className="hidden" />
                          <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('id-upload')?.click()}>
                            Selecionar arquivo
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="id-back-upload">RG (Verso) - se aplicável</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-gray-400" />
                          <div className="text-sm font-medium">Arraste seu arquivo ou clique para fazer upload</div>
                          <div className="text-xs text-gray-500">Suportamos JPG, PNG ou PDF até 5MB</div>
                          <Input id="id-back-upload" type="file" className="hidden" />
                          <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('id-back-upload')?.click()}>
                            Selecionar arquivo
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="selfie-upload">Selfie com Documento</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-gray-400" />
                          <div className="text-sm font-medium">Tire uma selfie segurando seu documento</div>
                          <div className="text-xs text-gray-500">Suportamos JPG ou PNG até 5MB</div>
                          <Input id="selfie-upload" type="file" className="hidden" />
                          <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('selfie-upload')?.click()}>
                            Selecionar arquivo
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 bg-bestcode-50 p-4 rounded-md">
                      <div className="flex items-start gap-2">
                        <Check className="text-bestcode-600 mt-0.5" size={18} />
                        <div>
                          <h4 className="font-medium text-sm">Seus documentos estão seguros</h4>
                          <p className="text-xs text-gray-600">
                            Utilizamos criptografia de ponta-a-ponta e seus documentos são utilizados apenas para verificação de identidade.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Study Preferences */}
                {currentStep === 3 && (
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
                )}

                <div className="flex justify-between pt-4">
                  {currentStep > 1 ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={goToPreviousStep}
                      disabled={isSubmitting}
                    >
                      <ChevronLeft className="mr-1" size={16} />
                      Voltar
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <Button 
                      type="button" 
                      onClick={goToNextStep}
                      className="bg-bestcode-600 hover:bg-bestcode-700"
                    >
                      Próximo
                      <ChevronRight className="ml-1" size={16} />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      className="bg-bestcode-600 hover:bg-bestcode-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Finalizando..." : "Finalizar Matrícula"}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Enrollment;
