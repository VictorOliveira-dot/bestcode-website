
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
      
      // Only check enrollment status for students
      if (user.role === 'student') {
        // Check if the user has completed their enrollment
        const checkEnrollmentStatus = async () => {
          try {
            // Check if student application exists and its status
            const { data: applicationData, error: applicationError } = await supabase
              .from('student_applications')
              .select('status')
              .eq('user_id', user.id)
              .maybeSingle();
            
            if (applicationError) {
              console.error("Error fetching application data:", applicationError);
            }
            
            // If application doesn't exist or status is pending, redirect to enrollment
            if (!applicationData || applicationData.status === 'pending') {
              console.log("Application not complete, redirecting to enrollment");
              toast.info("Por favor, complete seu cadastro para continuar.");
              navigate('/enrollment', { replace: true });
              return;
            }
            
            // Check if profile is complete as an extra verification
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('is_profile_complete')
              .eq('id', user.id)
              .maybeSingle();
              
            if (profileError) {
              console.error("Error fetching profile data:", profileError);
            }
            
            if (!profileData || !profileData.is_profile_complete) {
              console.log("Profile not complete, redirecting to enrollment");
              toast.info("Por favor, complete seu perfil para continuar.");
              navigate('/enrollment', { replace: true });
              return;
            }
            
            // Check if user is active (payment completed)
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('is_active')
              .eq('id', user.id)
              .single();
              
            if (userError) {
              console.error("Error fetching user active status:", userError);
            }
            
            if (!userData?.is_active) {
              console.log("User not active, redirecting to checkout");
              toast.info("Por favor, complete o pagamento para acessar o curso.");
              navigate('/checkout', { replace: true });
              return;
            }
            
            // If all checks pass, redirect based on user role
            redirectBasedOnRole();
          } catch (error) {
            console.error("Error checking enrollment status:", error);
            // In case of error, try regular redirection
            redirectBasedOnRole();
          }
        };
        
        checkEnrollmentStatus();
      } else {
        // For non-students, just redirect based on role
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
              ← Back to home page
            </Link>
            <h1 className="text-3xl font-bold text-center">Access your account</h1>
            <p className="text-gray-600 mt-2 text-center">
              Enter your credentials to access the platform
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
