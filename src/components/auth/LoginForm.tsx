
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import LoginFormHeader from "./LoginFormHeader";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import LoginFormActions from "./LoginFormActions";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // This effect runs when the user state changes
  useEffect(() => {
    if (user) {
      console.log("Usuário autenticado, redirecionando:", user.role);
      
      // Add a small delay to ensure state is properly updated
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (user.role === "teacher") {
          navigate("/teacher/dashboard");
        } else if (user.role === "student") {
          navigate("/student/dashboard");
        }
      }, 100);
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setErrorMessage(null);

    console.log("Tentando login com email:", email);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast({
          title: "Login bem-sucedido!",
          description: "Você foi autenticado.",
        });
        console.log("Login bem-sucedido");
      } else {
        console.log("Erro de login:", result.message);
        setErrorMessage(result.message || "Login inválido. Tente novamente.");
        toast({
          variant: "destructive",
          title: "Não foi possível fazer login",
          description: result.message || "Login inválido. Tente novamente.",
        });
      }
    } catch (error: any) {
      console.error("Erro de login:", error);
      setErrorMessage(error.message || "Ocorreu um erro durante o login. Tente novamente.");
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: error.message || "Ocorreu um erro durante o login. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already logged in, redirect immediately
  if (user) {
    console.log("Usuário já autenticado, redirecionando imediatamente:", user.role);
    if (user.role === "admin") {
      return <>{navigate("/admin/dashboard")}</>;
    } else if (user.role === "teacher") {
      return <>{navigate("/teacher/dashboard")}</>;
    } else if (user.role === "student") {
      return <>{navigate("/student/dashboard")}</>;
    }
  }

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
              disabled={isLoading}
            />
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                <p className="font-medium">Erro: {errorMessage}</p>
                <p className="text-xs mt-1">Verifique se o email e senha estão corretos.</p>
              </div>
            )}
            <LoginFormActions 
              isLoading={isLoading} 
              onForgotPassword={() => setShowForgotPassword(true)}
            />
          </form>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <div className="mt-4 text-xs bg-blue-50 p-3 rounded-lg">
              <p><strong>Credenciais de Teste:</strong></p>
              <ul className="mt-1 list-disc list-inside text-left">
                <li>Admin: <code>admin@bestcode.com</code> / <code>Senha123!</code></li>
                <li>Professor: <code>professor@bestcode.com</code> / <code>Senha123!</code></li>
                <li>Aluno: <code>aluno@bestcode.com</code> / <code>Senha123!</code></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
};

export default LoginForm;
