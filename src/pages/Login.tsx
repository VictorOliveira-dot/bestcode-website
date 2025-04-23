
import React, { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/auth";

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated and redirect to appropriate dashboard
  useEffect(() => {
    if (!loading && user) {
      console.log("Login page - redirecting user to dashboard:", user.role);
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "teacher") {
        navigate("/teacher/dashboard", { replace: true });
      } else if (user.role === "student") {
        navigate("/student/dashboard", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // If user is already authenticated, return null while the useEffect handles the redirect
  if (!loading && user) {
    return null;
  }

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
