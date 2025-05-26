
import React, { useState } from "react";
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

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect only when user is authenticated
  React.useEffect(() => {
    if (user && !isLoading) {
      console.log('[LoginForm] User authenticated, redirecting...', user);
      
      let redirectPath = "/";
      
      if (user.role === "admin") {
        redirectPath = "/admin/dashboard";
      } else if (user.role === "teacher") {
        redirectPath = "/teacher/dashboard";
      } else if (user.role === "student") {
        redirectPath = "/student/dashboard";
      }
      
      toast.success("Login bem-sucedido!", {
        description: `Bem-vindo de volta, ${user.name}!`,
      });
      
      console.log('[LoginForm] Redirecting to:', redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    setErrorMessage(null);

    console.log("[LoginForm] Attempting login with email:", email);

    const result = await login(email, password);
    
    if (!result.success) {
      console.log("[LoginForm] Login failed:", result.message);
      setErrorMessage(result.message || "Login inválido. Tente novamente.");
      toast.error("Não foi possível fazer login", {
        description: result.message || "Login inválido. Tente novamente.",
      });
    }
    
    setIsLoading(false);
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
