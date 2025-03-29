
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="container-custom">
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="text-bestcode-600 hover:text-bestcode-700 mb-8">
              ← Voltar para a página inicial
            </Link>
            <h1 className="text-3xl font-bold text-center">Crie sua conta</h1>
            <p className="text-gray-600 mt-2 text-center">
              Registre-se para acessar os cursos e recursos da plataforma
            </p>
          </div>
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
