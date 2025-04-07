
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
import TestAccountInfo from "./TestAccountInfo";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Mapeamento de usuários de teste para verificação direta
  const TEST_USERS = {
    "professor@bestcode.com": {
      password: "teacher123",
      name: "Professor Silva",
      role: "teacher",
    },
    "aluno@bestcode.com": {
      password: "student123",
      name: "Maria Aluna",
      role: "student",
    },
    "admin@bestcode.com": {
      password: "admin123",
      name: "Admin Sistema",
      role: "admin",
    },
  };

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
      
      // Verificar primeiro se é um usuário de teste
      const testUser = TEST_USERS[email.toLowerCase()];
      if (testUser && testUser.password === password) {
        // Login com usuário de teste
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo de volta, ${testUser.name}!`,
        });
        
        // Guardar informações do usuário no localStorage
        const userInfo = {
          id: email.split('@')[0] + '_id',
          name: testUser.name,
          email: email,
          role: testUser.role
        };
        localStorage.setItem('bestcode_user', JSON.stringify(userInfo));
        
        // Pequeno delay para melhorar UX
        setTimeout(() => {
          if (testUser.role === "teacher") {
            navigate("/teacher/dashboard");
          } else if (testUser.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/student/dashboard");
          }
        }, 300);
        return;
      }
      
      // Se não for usuário de teste, tentar login com Supabase
      const userData = await login(email, password);
      
      if (userData) {
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo de volta, ${userData.name || userData.email}!`,
        });
        
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
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: "Email ou senha inválidos. Verifique suas credenciais e tente novamente.",
        });
      }
    } catch (error: any) {
      console.error("Erro de login:", error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error.message || "Ocorreu um problema ao tentar fazer login. Tente novamente.",
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
            
            <TestAccountInfo />
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
