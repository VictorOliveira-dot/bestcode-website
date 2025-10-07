
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
      console.log('Iniciando login para:', email);
      const result = await login(email, password);
      console.log('Resultado do login:', result);
      
      if (!result.success) {
        console.error('Login falhou:', result.message);
        setErrorMessage(result.message || "Login inválido. Tente novamente.");
        toast.error("Não foi possível fazer login", {
          description: result.message || "Login inválido. Tente novamente.",
        });
      } else {
        console.log('Login bem-sucedido, buscando dados do usuário...');
        
        // Buscar dados do usuário após login bem-sucedido
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userData = await fetchUserData(session.user);
          console.log('Dados do usuário:', userData);
          
          if (userData) {
            const authUser = {
              id: session.user.id,
              email: session.user.email || '',
              name: userData.name,
              role: userData.role as 'admin' | 'teacher' | 'student',
            };
            
            console.log('Usuário autenticado:', authUser);
            setUser(authUser);
            await checkUserStatusAndRedirect(authUser);
          }
        }
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
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
      console.error('Usuário não fornecido para redirecionamento');
      return;
    }
    
    console.log('Verificando status e redirecionando usuário:', user.role);
    
    try {
      // Admin e Teacher redirecionam imediatamente
      if (user.role === 'admin' || user.role === 'teacher') {
        const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/teacher/dashboard';
        
        console.log('Redirecionando', user.role, 'para:', redirectPath);
        
        toast.success("Login bem-sucedido!", {
          description: `Bem-vindo de volta, ${user.name}!`,
        });
        
        navigate(redirectPath, { replace: true });
        return;
      }
      
      // Para estudantes, verificar status
      if (user.role === 'student') {
        console.log('Verificando status do estudante...');
        
        // Verificar se o usuário está ativo
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('is_active')
          .eq('id', user.id)
          .single();
        
        console.log('Status do usuário:', userData);
          
        if (userError) {
          console.error('Erro ao buscar status do usuário:', userError);
        }
        
        if (!userData?.is_active) {
          console.log('Usuário não está ativo');
          toast.warning("Conta inativa", {
            description: "Por favor, entre em contato conosco para ativar sua conta.",
          });
          return;
        }
        
        // Usuário ativo, redirecionar para dashboard
        console.log('Estudante ativo, redirecionando para dashboard');
        
        toast.success("Login bem-sucedido!", {
          description: `Bem-vindo de volta, ${user.name}!`,
        });
        
        navigate('/student/dashboard', { replace: true });
      }
      
    } catch (error) {
      console.error('Erro ao verificar status do usuário:', error);
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
