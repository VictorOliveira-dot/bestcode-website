
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

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setErrorMessage(null);

    console.log("Attempting login with email:", email);

    try {
      const result = await login(email, password);
      
      if (!result.success) {
        console.log("Login error:", result.message);
        setErrorMessage(result.message || "Login inválido. Tente novamente.");
        toast.error("Não foi possível fazer login", {
          description: result.message || "Login inválido. Tente novamente.",
        });
      } else if (result.user) {
        // Login bem-sucedido, verificar dados do usuário e redirecionar
        console.log("Login successful, user data:", result.user);
        
        // Redirecionar com base no papel e status do usuário
        if (result.user.role === "admin") {
          console.log("Redirecting admin to dashboard");
          toast.success("Login bem-sucedido!", {
            description: `Bem-vindo de volta, ${result.user.name}!`,
          });
          navigate("/admin/dashboard", { replace: true });
        } else if (result.user.role === "teacher") {
          console.log("Redirecting teacher to dashboard");
          toast.success("Login bem-sucedido!", {
            description: `Bem-vindo de volta, ${result.user.name}!`,
          });
          navigate("/teacher/dashboard", { replace: true });
        } else if (result.user.role === "student") {
          console.log("Student login - is_active:", result.user.is_active);
          
          if (result.user.is_active) {
            // Estudante ativo - redirecionar para dashboard
            console.log("Student is active, redirecting to dashboard");
            toast.success("Login bem-sucedido!", {
              description: `Bem-vindo de volta, ${result.user.name}!`,
            });
            navigate("/student/dashboard", { replace: true });
          } else {
            // Estudante não ativo - redirecionar para checkout
            console.log("Student not active, redirecting to checkout");
            toast.info("Por favor, complete o pagamento para acessar o curso.");
            navigate("/checkout", { replace: true });
          }
        } else {
          // Fallback para página inicial
          console.log("Unknown role, redirecting to home");
          navigate("/", { replace: true });
        }
      }
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
