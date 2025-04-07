
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/auth/LoginForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Login = () => {
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
              Entre com suas credenciais para acessar a plataforma
            </p>
          </div>
          
          <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800 max-w-md mx-auto">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Use as contas de teste listadas abaixo para acessar o sistema.
            </AlertDescription>
          </Alert>
          
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
