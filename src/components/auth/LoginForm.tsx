
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";
import ForgotPasswordModal from "./ForgotPasswordModal";
import LoginFormHeader from "./LoginFormHeader";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import LoginFormActions from "./LoginFormActions";
import { supabase } from "@/integrations/supabase/client";
import TestAccountInfo from "./TestAccountInfo";
import { useLoginSessionRedirect } from "./useLoginSessionRedirect";

// Test users for direct validation
const TEST_USERS = [
  { email: 'admin@bestcode.com', password: 'admin123', role: 'admin' },
  { email: 'professor@bestcode.com', password: 'teacher123', role: 'teacher' },
  { email: 'aluno@bestcode.com', password: 'student123', role: 'student' }
];

const LoginForm = () => {
  // Hook de redirecionamento
  useLoginSessionRedirect();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuth();

  // Limpar inputs ao montar o componente
  useEffect(() => {
    setEmail("");
    setPassword("");
    setErrorMessage(null);
    
    // Limpar eventuais sessões anteriores ao montar
    const clearSession = async () => {
      try {
        await supabase.auth.signOut();
        localStorage.removeItem('bestcode_user');
        console.log("Session cleared on component mount");
      } catch (err) {
        console.error("Error clearing session:", err);
      }
    };
    
    clearSession();
  }, []);

  // Executar login
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

      // Normalizar email
      const cleanEmail = email.trim().toLowerCase();
      console.log(`Tentativa de login com: ${cleanEmail}`);
      
      // Verificar se é uma conta de teste
      const isTestAccount = TEST_USERS.some(user => 
        user.email.toLowerCase() === cleanEmail.toLowerCase()
      );
      
      if (isTestAccount) {
        console.log("Conta de teste detectada");
      }

      // Tentar login pelo hook de autenticação
      try {
        const userData = await login(cleanEmail, password);
        
        if (userData) {
          console.log("Login bem-sucedido via hook:", userData);
          toast({
            title: "Login bem-sucedido",
            description: `Bem-vindo, ${userData.name || userData.email}!`,
          });
          
          // Redirecionar com base no papel
          if (userData.role === "teacher") {
            window.location.href = "/teacher/dashboard";
          } else if (userData.role === "admin") {
            window.location.href = "/admin/dashboard";
          } else {
            window.location.href = "/student/dashboard";
          }
          return;
        } else {
          throw new Error("Login falhou - usuário não encontrado");
        }
      } catch (error: any) {
        console.error("Erro no login:", error);
        
        if (isTestAccount) {
          setErrorMessage(`Credenciais de teste são válidas mas não conseguimos autenticar. Erro: ${error.message}`);
        } else {
          setErrorMessage("Credenciais inválidas. Verifique seu email e senha.");
        }
        
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: error.message || "Verifique suas credenciais e tente novamente.",
        });
      }
    } catch (error: any) {
      console.error("Erro geral no login:", error);
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
                <p className="mt-1 text-xs">Se estiver usando uma conta de teste, certifique-se de digitar as credenciais exatamente como mostrado abaixo.</p>
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
