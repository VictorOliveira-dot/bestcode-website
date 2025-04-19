
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import ForgotPasswordModal from "./ForgotPasswordModal";
import LoginFormHeader from "./LoginFormHeader";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import LoginFormActions from "./LoginFormActions";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      
      console.log("Tentando login com email:", email);
      
      // IMPORTANTE: Mantenha os dados exatamente como digitados pelo usuário
      const userData = await login(email, password);
      
      if (userData) {
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo de volta, ${userData.name || userData.email}!`,
        });
        
        console.log("Login bem-sucedido, redirecionando para:", userData.role);
        
        // Pequeno delay para melhorar UX
        setTimeout(() => {
          if (userData.role === "teacher") {
            navigate("/teacher/dashboard");
          } else if (userData.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/student/dashboard");
          }
        }, 300);
      }
    } catch (error: any) {
      console.error("Erro de login:", error);
      
      // Mensagem de erro mais específica
      let errorMessage = "Email ou senha inválidos. Verifique suas credenciais e tente novamente.";
      
      if (error?.message) {
        console.log("Erro específico:", error.message);
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Credenciais inválidas. Verifique seu email e senha e tente novamente.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <LoginFormHeader />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <EmailField 
              email={email}
              setEmail={setEmail}
              disabled={isLoading}
            />
            
            <PasswordField
              password={password}
              setPassword={setPassword}
              onForgotPassword={() => setIsForgotPasswordOpen(true)}
              disabled={isLoading}
            />
            
            <LoginFormActions isLoading={isLoading} />
            
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="text-sm font-bold text-yellow-800">Contas de teste:</h3>
              <ul className="mt-2 text-sm text-yellow-700 list-disc pl-5">
                <li><strong>Admin:</strong> admin@bestcode.com (Senha: Senha123!)</li>
                <li><strong>Professor:</strong> professor@bestcode.com (Senha: Senha123!)</li>
                <li><strong>Aluno:</strong> aluno@bestcode.com (Senha: Senha123!)</li>
              </ul>
              <p className="mt-2 text-xs text-yellow-600 italic">Certifique-se de digitar a senha exatamente como mostrada acima, incluindo a letra maiúscula e o ponto de exclamação.</p>
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
