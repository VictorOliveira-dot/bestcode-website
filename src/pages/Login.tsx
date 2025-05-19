
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated and redirect to appropriate page
  useEffect(() => {
    if (!loading && user) {
      console.log("Login page - User authenticated:", user);
      console.log("Login page - User role from public.users table:", user.role);
      
      // Verificar o papel do usuário e redirecionar de acordo
      if (user.role === 'student') {
        // Verificar o status da inscrição e pagamento para estudantes
        const checkStudentStatus = async () => {
          try {
            // Verificar se a aplicação do estudante existe e seu status
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
            
            // Verificar se o perfil está completo como verificação adicional
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
            
            // Se todas as verificações passarem, redirecionar com base na função do usuário
            redirectBasedOnRole();
          } catch (error) {
            console.error("Error checking student status:", error);
            // Em caso de erro, tentar redirecionamento regular
            redirectBasedOnRole();
          }
        };
        
        checkStudentStatus();
      } else {
        // Para não-estudantes, apenas redirecionar com base na função
        redirectBasedOnRole();
      }
    }
  }, [user, loading, navigate]);

  // Helper function to redirect based on user role
  const redirectBasedOnRole = () => {
    if (!user) return;
    
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
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="container-custom">
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="text-bestcode-600 hover:text-bestcode-700 mb-8">
              ← Voltar para a página inicial
            </Link>
            <h1 className="text-3xl font-bold text-center">Acesse sua conta</h1>
            <p className="text-gray-600 mt-2 text-center">
              Digite suas credenciais para acessar a plataforma
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bestcode-600"></div>
            </div>
          ) : (
            <LoginForm />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
