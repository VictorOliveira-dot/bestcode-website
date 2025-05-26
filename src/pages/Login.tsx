
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/auth";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const { loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Back link */}
          <div className="text-center mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-bestcode-600 hover:text-bestcode-700 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para a página inicial
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Acesse sua conta
            </h1>
            <p className="text-gray-600">
              Digite suas credenciais para acessar a plataforma
            </p>
          </div>
          
          {/* Loading or Form */}
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
