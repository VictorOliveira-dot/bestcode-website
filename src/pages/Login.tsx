
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/auth";

const Login = () => {
  const { loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-8 sm:py-12">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <LoginForm />
          <div className="flex flex-col items-center mt-4">
            <Link to="/" className="text-bestcode-600 hover:text-bestcode-700 mb-8">
              ← Voltar para a página inicial
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
