
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated and redirect to appropriate dashboard
  useEffect(() => {
    if (!loading && user) {
      console.log("Login page - User authenticated:", user);
      console.log("Login page - User role:", user.role);
      
      // Properly redirect based on user role
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
      toast({
        title: "Login bem-sucedido!",
        description: `Bem-vindo de volta, ${user.name}!`,
      });
      
      // Navigate to dashboard
      console.log("Final redirect path:", redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [user, loading, navigate]);

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
