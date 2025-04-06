
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

interface LoginFormActionsProps {
  isLoading: boolean;
}

const LoginFormActions = ({ isLoading }: LoginFormActionsProps) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox id="remember" disabled={isLoading} />
        <Label htmlFor="remember" className="text-sm font-normal">
          Lembrar de mim
        </Label>
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full bg-bestcode-600 hover:bg-bestcode-700" 
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </div>
      
      <div className="text-center text-sm">
        Não tem uma conta?{" "}
        <Link to="/register" className="text-bestcode-600 hover:text-bestcode-800 font-medium">
          Registre-se
        </Link>
      </div>
    </>
  );
};

export default LoginFormActions;
