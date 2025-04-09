import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    if (!agreeTerms) {
      toast({
        variant: "destructive",
        title: "Termos e condições",
        description: "Você precisa concordar com os termos para continuar.",
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro na senha",
        description: "As senhas não coincidem. Por favor, verifique.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First, let's try to use test accounts for development
      if (
        formData.email === "professor@bestcode.com" || 
        formData.email === "aluno@bestcode.com" || 
        formData.email === "admin@bestcode.com"
      ) {
        // Handle test accounts login directly
        const testRole = 
          formData.email === "professor@bestcode.com" ? "teacher" :
          formData.email === "admin@bestcode.com" ? "admin" : "student";
          
        const testUserId = 
          formData.email === "professor@bestcode.com" ? "1" :
          formData.email === "admin@bestcode.com" ? "3" : "2";
          
        // Store the test user in local storage to simulate login
        const testUser = {
          id: testUserId,
          name: formData.name || formData.email.split('@')[0],
          email: formData.email,
          role: testRole
        };
        
        localStorage.setItem('bestcode_user', JSON.stringify(testUser));
        
        toast({
          title: "Conta de teste utilizada",
          description: `Bem-vindo ${testUser.name}! Redirecionando...`,
        });
        
        // Redirect based on role
        setTimeout(() => {
          if (testRole === "teacher") {
            navigate("/teacher/dashboard");
          } else if (testRole === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/student/dashboard");
          }
        }, 1500);
        
        return;
      }
      
      // For real registration, use the register function from AuthContext
      const userData = {
        name: formData.name,
        role: formData.role
      };
      
      console.log("Registrando com dados:", {
        email: formData.email,
        role: formData.role
      });
      
      const result = await register(formData.email, formData.password, userData);
      
      if (result) {
        toast({
          title: "Conta criada com sucesso!",
          description: `Conta ${formData.role} criada. Redirecionando...`,
        });
        
        // Pequeno delay para melhorar UX
        setTimeout(() => {
          if (formData.role === "teacher") {
            navigate("/teacher/dashboard");
          } else if (formData.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/student/dashboard");
          }
        }, 1500);
      }
    } catch (error: any) {
      console.error("Erro de registro:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um problema ao tentar criar sua conta. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Criar uma conta</CardTitle>
        <CardDescription>
          Preencha os dados abaixo para criar sua conta na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input 
              id="name" 
              name="name"
              placeholder="Seu nome completo" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              placeholder="seu@email.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password" 
              name="password"
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword"
              type="password" 
              placeholder="••••••••" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Função na plataforma</Label>
            <Select 
              value={formData.role} 
              onValueChange={handleRoleChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione sua função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Aluno</SelectItem>
                <SelectItem value="teacher">Professor</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm font-normal">
              Concordo com os{" "}
              <Link to="/terms" className="text-bestcode-600 hover:text-bestcode-800">
                termos de serviço
              </Link>{" "}
              e{" "}
              <Link to="/privacy-policy" className="text-bestcode-600 hover:text-bestcode-800">
                política de privacidade
              </Link>
            </Label>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-bestcode-600 hover:bg-bestcode-700" 
            disabled={isLoading || !agreeTerms}
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
          <div className="text-center text-sm">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-bestcode-600 hover:text-bestcode-800 font-medium">
              Faça login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
