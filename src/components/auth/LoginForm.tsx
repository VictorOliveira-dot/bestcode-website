
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import ForgotPasswordModal from "./ForgotPasswordModal";
import LoginFormHeader from "./LoginFormHeader";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import LoginFormActions from "./LoginFormActions";
import TestAccountInfo from "./TestAccountInfo";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setPassword("");
    setErrorMessage(null);
  }, []);

  // Redireciona usuário já logado para sua respectiva dashboard
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (user.role === "student") {
        navigate("/student/dashboard");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || loading) return;

    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!email || !password) {
        setErrorMessage("Por favor, preencha todos os campos");
        toast({
          variant: "destructive",
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos.",
        });
        setIsLoading(false);
        return;
      }

      // Utiliza autenticação real do Supabase via contexto
      const result = await login(email, password);
      if (result.success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Você foi autenticado.",
          variant: "default",
        });
        // O efeito acima já redireciona o usuário para a dashboard apropriada
      } else {
        setErrorMessage(result.message || "Login inválido. Tente novamente.");
        toast({
          title: "Não foi possível fazer login",
          description: result.message || "Login inválido. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Login falhou. Por favor, tente novamente.");
      toast({
        title: "Erro de autenticação",
        description: error.message || "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive",
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
              disabled={isLoading || loading}
            />
            <PasswordField
              password={password}
              setPassword={setPassword}
              onForgotPassword={() => setIsForgotPasswordOpen(true)}
              disabled={isLoading || loading}
            />
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                <p className="font-medium">Erro: {errorMessage}</p>
              </div>
            )}
            <LoginFormActions isLoading={isLoading || loading} />
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
