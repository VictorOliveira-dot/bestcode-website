
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import LoginFormHeader from "./LoginFormHeader";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import LoginFormActions from "./LoginFormActions";
import { useAuth } from "@/contexts/auth";
import ForgotPasswordModal from "./ForgotPasswordModal";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  // Effect para redirecionar quando o usuário for definido
  useEffect(() => {
    if (user && !loading) {
      console.log('[LoginForm] User logged in, redirecting...', user);
      
      let redirectPath = "/";
      
      if (user.role === "admin") {
        redirectPath = "/admin/dashboard";
      } else if (user.role === "teacher") {
        redirectPath = "/teacher/dashboard";
      } else if (user.role === "student") {
        redirectPath = "/student/dashboard";
      }
      
      console.log('[LoginForm] Redirecting to:', redirectPath);
      
      toast.success("Login bem-sucedido!", {
        description: "Redirecionando...",
      });
      
      navigate(redirectPath, { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    setErrorMessage(null);

    console.log("Attempting login with email:", email);

    try {
      const result = await login(email, password);
      console.log("Login result:", result);
      
      if (!result.success) {
        console.log("Login error:", result.message);
        setErrorMessage(result.message || "Login inválido. Tente novamente.");
        toast.error("Não foi possível fazer login", {
          description: result.message || "Login inválido. Tente novamente.",
        });
      }
      // Se o login foi bem-sucedido, o useEffect acima irá cuidar do redirecionamento
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(error.message || "Ocorreu um erro durante o login. Tente novamente.");
      toast.error("Erro de autenticação", {
        description: error.message || "Ocorreu um erro durante o login. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <LoginFormHeader />
        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                <p className="font-medium">Erro: {errorMessage}</p>
                <p className="text-xs mt-1">Verifique se o email e senha estão corretos.</p>
              </div>
            )}
            <LoginFormActions 
              isLoading={isLoading} 
              onForgotPassword={() => setShowForgotPassword(true)}
            />
          </form>
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
