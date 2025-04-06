
import React from "react";
import { 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const LoginFormHeader = () => {
  return (
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-bold">Entrar na sua conta</CardTitle>
      <CardDescription>
        Digite suas credenciais abaixo para acessar a plataforma
      </CardDescription>
    </CardHeader>
  );
};

export default LoginFormHeader;
