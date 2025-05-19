
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

    console.log("Attempting login with email:", email);

    try {
      const result = await login(email, password);
      
      if (!result.success) {
        console.log("Login error:", result.message);
        setErrorMessage(result.message || "Login inválido. Tente novamente.");
        toast.error("Não foi possível fazer login", {
          description: result.message || "Login inválido. Tente novamente.",
        });
      } else {
        // Login bem-sucedido, vamos verificar o status do usuário e redirecionar
        
        // Definir o usuário no contexto de autenticação
        if (result.user) {
          setUser(result.user);
          
          // Verificar o status do usuário e redirecionar adequadamente
          await checkUserStatusAndRedirect(result.user);
        } else {
          // Se não tiver dados de usuário no resultado, buscar diretamente
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

  // Função para verificar o status do usuário e redirecionar
  const checkUserStatusAndRedirect = async (user: any) => {
    if (!user) return;
    
    try {
      if (user.role === 'student') {
        // Verificar o status da inscrição e pagamento para estudantes
        const { data: applicationData, error: applicationError } = await supabase
          .from('student_applications')
          .select('status')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (applicationError && applicationError.code !== 'PGRST116') {
          console.error("Error fetching application data:", applicationError);
        }
        
        // Se a aplicação não existe ou está pendente, redirecionar para inscrição
        if (!applicationData || applicationData.status === 'pending') {
          console.log("Application not complete, redirecting to enrollment");
          toast.info("Por favor, complete seu cadastro para continuar.");
          navigate('/inscricao', { replace: true });
          return;
        }
        
        // Verificar se o perfil está completo
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('is_profile_complete')
          .eq('id', user.id)
          .maybeSingle();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile data:", profileError);
        }
        
        if (!profileData || !profileData.is_profile_complete) {
          console.log("Profile not complete, redirecting to enrollment");
          toast.info("Por favor, complete seu perfil para continuar.");
          navigate('/inscricao', { replace: true });
          return;
        }
        
        // Verificar se o usuário está ativo (pagamento concluído)
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('is_active')
          .eq('id', user.id)
          .maybeSingle();
          
        if (userError) {
          console.error("Error fetching user active status:", userError);
        }
        
        if (!userData?.is_active) {
          console.log("User not active, redirecting to checkout");
          toast.info("Por favor, complete o pagamento para acessar o curso.");
          navigate('/checkout', { replace: true });
          return;
        }
      }
      
      // Redirecionar com base na função do usuário
      let redirectPath = "/";
      
      if (user.role === "admin") {
        redirectPath = "/admin/dashboard";
        console.log("Redirecting to admin dashboard");
      } else if (user.role === "teacher") {
        redirectPath = "/teacher/dashboard";
        console.log("Redirecting to teacher dashboard");
      } else if (user.role === "student") {
        redirectPath = "/student/dashboard";
        console.log("Redirecting to student dashboard");
      }
      
      // Show success message
      toast.success("Login bem-sucedido!", {
        description: `Bem-vindo de volta, ${user.name}!`,
      });
      
      // Navigate to dashboard
      console.log("Final redirect path:", redirectPath);
      navigate(redirectPath, { replace: true });
      
    } catch (error) {
      console.error("Error checking user status:", error);
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
