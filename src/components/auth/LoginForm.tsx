import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import ForgotPasswordModal from "./ForgotPasswordModal";
import LoginFormHeader from "./LoginFormHeader";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import LoginFormActions from "./LoginFormActions";
import TestAccountInfo from "./TestAccountInfo";

// Remove constantes de teste relacionadas à Supabase
const TEST_USERS = [
  { email: 'admin@bestcode.com', password: 'admin123', role: 'admin' },
  { email: 'professor@bestcode.com', password: 'teacher123', role: 'teacher' },
  { email: 'aluno@bestcode.com', password: 'student123', role: 'student' }
];

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setErrorMessage(null);
    // Nenhuma sessão a limpar pois não há backend configurado
  }, []);

  // Desabilitamos a autenticação real, agora só valida email/senha em branco.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

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

      // Apenas fluxo fictício
      toast({
        title: "Login desabilitado",
        description: "A autenticação está desativada. Integre um backend para login real.",
        variant: "destructive"
      });
      setErrorMessage("Login desabilitado. Backend não configurado.");
    } catch (error: any) {
      setErrorMessage(error.message || "Login falhou. Por favor, tente novamente.");
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
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                <p className="font-medium">Erro: {errorMessage}</p>
              </div>
            )}
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
