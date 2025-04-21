
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import ForgotPasswordModal from "./ForgotPasswordModal";
import LoginFormHeader from "./LoginFormHeader";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import LoginFormActions from "./LoginFormActions";
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
    // Reset form and error states on component mount
    setEmail("");
    setPassword("");
    setErrorMessage(null);
  }, []);

  // Redirect authenticated user to their respective dashboard
  useEffect(() => {
    if (user) {
      console.log("Usuário autenticado, redirecionando baseado no papel:", user.role);
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
    
    // Avoid double submission
    if (isLoading || loading) return;

    // Clear previous error
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Log form submission
      console.log("Submetendo formulário de login para:", email);
      
      // Basic validation
      if (!email.trim() || !password.trim()) {
        setErrorMessage("Por favor, preencha todos os campos");
        toast({
          variant: "destructive",
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos.",
        });
        setIsLoading(false);
        return;
      }

      // Specific credentials validation for test accounts
      const testAccounts = [
        { email: "admin@bestcode.com", password: "admin123" },
        { email: "professor@bestcode.com", password: "teacher123" },
        { email: "aluno@bestcode.com", password: "student123" }
      ];
      
      const matchedAccount = testAccounts.find(account => account.email === email.trim());
      if (matchedAccount && matchedAccount.password !== password) {
        console.log("Senha incorreta para conta de teste");
        toast({
          variant: "destructive",
          title: "Senha incorreta",
          description: `A senha para ${email} está incorreta. Use '${matchedAccount.password}'`,
        });
        setErrorMessage(`Senha incorreta para ${email}. Use '${matchedAccount.password}'`);
        setIsLoading(false);
        return;
      }

      // Use real Supabase authentication via context
      const result = await login(email, password);
      
      console.log("Resultado do login:", result);
      
      if (result.success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Você foi autenticado.",
          variant: "default",
        });
        // The effect above will redirect user to appropriate dashboard
      } else {
        // Display specific error message returned by login function
        setErrorMessage(result.message || "Login inválido. Tente novamente.");
        toast({
          variant: "destructive",
          title: "Não foi possível fazer login",
          description: result.message || "Login inválido. Tente novamente.",
        });
      }
    } catch (error: any) {
      console.error("Erro durante login:", error);
      setErrorMessage(error.message || "Login falhou. Por favor, tente novamente.");
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
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
