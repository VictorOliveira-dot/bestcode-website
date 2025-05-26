
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

interface LoginFormActionsProps {
  isLoading: boolean;
  onForgotPassword: () => void;
}

const LoginFormActions = ({ isLoading, onForgotPassword }: LoginFormActionsProps) => {
  return (
    <>
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" disabled={isLoading} />
          <Label htmlFor="remember" className="text-sm font-normal text-gray-600">
            Lembrar de mim
          </Label>
        </div>
        <Button
          type="button"
          variant="link"
          className="text-sm text-bestcode-600 hover:text-bestcode-800 p-0 h-auto"
          onClick={onForgotPassword}
          disabled={isLoading}
        >
          Esqueceu a senha?
        </Button>
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full bg-bestcode-600 hover:bg-bestcode-700 text-white font-medium py-2.5 rounded-lg transition-colors" 
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </div>
      
      <div className="text-center text-sm pt-4">
        <span className="text-gray-600">Não tem uma conta? </span>
        <Link to="/register" className="text-bestcode-600 hover:text-bestcode-800 font-medium">
          Registre-se
        </Link>
      </div>
    </>
  );
};

export default LoginFormActions;
