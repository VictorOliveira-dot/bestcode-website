
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const checkUserStatusAndRedirect = async () => {
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
        
        console.log("Final redirect path:", redirectPath);
        navigate(redirectPath, { replace: true });
        
      } catch (error) {
        console.error("Error checking user status:", error);
        toast.error("Erro ao verificar status do usuário");
      }
    };

    // Delay to ensure all auth state is settled
    const timeoutId = setTimeout(() => {
      checkUserStatusAndRedirect();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [user, navigate]);
};
