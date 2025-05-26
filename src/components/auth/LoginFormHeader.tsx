
import React from "react";
import { 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const LoginFormHeader = () => {
  return (
    <CardHeader className="space-y-1 text-center pb-6">
      <CardTitle className="text-2xl font-bold text-gray-900">Entrar na sua conta</CardTitle>
      <CardDescription className="text-gray-600">
        Digite suas credenciais abaixo para acessar a plataforma
      </CardDescription>
    </CardHeader>
  );
};

export default LoginFormHeader;
