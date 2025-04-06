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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      if (!email || !password) {
        toast({
          variant: "destructive",
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos.",
        });
        return;
      }
      
      const userData = await login(email, password);
      
      if (userData) {
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo de volta!`,
        });
        
        setTimeout(() => {
          if (userData.role === "teacher") {
            navigate("/teacher/dashboard");
          } else if (userData.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/student/dashboard");
          }
        }, 300);
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: "Email ou senha inválidos. Tente novamente.",
        });
      }
    } catch (error) {
      console.error("Erro de login:", error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Ocorreu um problema ao tentar fazer login. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Entrar na sua conta</CardTitle>
          <CardDescription>
            Digite suas credenciais abaixo para acessar a plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Button 
                  type="button" 
                  variant="link" 
                  className="p-0 h-auto text-sm text-bestcode-600 hover:text-bestcode-800"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  disabled={isLoading}
                >
                  Esqueceu a senha?
                </Button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Ocultar senha" : "Mostrar senha"}
                  </span>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" disabled={isLoading} />
              <Label htmlFor="remember" className="text-sm font-normal">
                Lembrar de mim
              </Label>
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-bestcode-600 hover:bg-bestcode-700" 
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
            
            <div className="text-center text-sm pt-2">
              <p className="mb-2 text-gray-600">
                <strong>Dados de teste:</strong>
              </p>
              <p className="text-gray-600">Professor: professor@bestcode.com / teacher123</p>
              <p className="text-gray-600">Aluno: aluno@bestcode.com / student123</p>
              <p className="text-gray-600">Admin: admin@bestcode.com / admin123</p>
            </div>
            
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-bestcode-600 hover:text-bestcode-800 font-medium">
                Registre-se
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <ForgotPasswordModal 
        isOpen={isForgotPasswordOpen} 
        onClose={() => setIsForgotPasswordOpen(false)} 
      />
    </>
  );
};

export default LoginForm;
