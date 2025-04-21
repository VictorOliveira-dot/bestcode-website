
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
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
          
          <LoginForm />
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Use your Supabase registered credentials</p>
            <p className="mt-2">Don't have an account yet? <Link to="/register" className="text-bestcode-600 hover:underline font-medium">Register here</Link></p>
            <div className="mt-4 text-xs bg-blue-50 p-3 rounded-lg">
              <p><strong>Test Users:</strong></p>
              <ul className="mt-1 list-disc list-inside text-left">
                <li>Email: <code>admin@bestcode.com</code> - Password: <code>Senha123!</code> (Admin)</li>
                <li>Email: <code>professor@bestcode.com</code> - Password: <code>Senha123!</code> (Teacher)</li>
                <li>Email: <code>aluno@bestcode.com</code> - Password: <code>Senha123!</code> (Student)</li>
              </ul>
              <p className="mt-1">If these test users don't work, you'll need to create them in your Supabase database first.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
