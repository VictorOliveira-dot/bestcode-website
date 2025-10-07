
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
import { supabase } from "@/integrations/supabase/client";
import { fetchUserData } from "@/services/authService";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await login(email, password);
      
      if (!result.success) {
        setErrorMessage(result.message || "Login inválido. Tente novamente.");
        toast.error("Não foi possível fazer login", {
          description: result.message || "Login inválido. Tente novamente.",
        });
      } else {
        
        // Buscar dados do usuário após login bem-sucedido
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userData = await fetchUserData(session.user);
          
          if (userData) {
            const authUser = {
              id: session.user.id,
              email: session.user.email || '',
              name: userData.name,
              role: userData.role as 'admin' | 'teacher' | 'student',
            };
            setUser(authUser);
            await checkUserStatusAndRedirect(authUser);
          }
        }
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Ocorreu um erro durante o login. Tente novamente.");
      toast.error("Erro de autenticação", {
        description: error.message || "Ocorreu um erro durante o login. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para verificar o status do usuário e redirecionar
  const checkUserStatusAndRedirect = async (user: any) => {
    if (!user) {
      return;
    }
    
    try {
      // Admin e Teacher redirecionam imediatamente
      if (user.role === 'admin' || user.role === 'teacher') {
        const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/teacher/dashboard';
        
        toast.success("Login bem-sucedido!", {
          description: `Bem-vindo de volta, ${user.name}!`,
        });
        
        navigate(redirectPath, { replace: true });
        return;
      }
      
      // Para estudantes, verificar status
      if (user.role === 'student') {
        
        // Verificar se o usuário está ativo
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('is_active')
          .eq('id', user.id)
          .single();
          
        if (userError) {
        }
        
        if (!userData?.is_active) {
          toast.warning("Conta inativa", {
            description: "Por favor, entre em contato conosco para ativar sua conta.",
          });
          return;
        }
        
        // Usuário ativo, redirecionar para dashboard
        
        toast.success("Login bem-sucedido!", {
          description: `Bem-vindo de volta, ${user.name}!`,
        });
        
        navigate('/student/dashboard', { replace: true });
      }
      
    } catch (error) {
      toast.error("Erro ao verificar status do usuário");
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
