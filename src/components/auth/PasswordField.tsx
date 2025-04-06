
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  password: string;
  setPassword: (value: string) => void;
  onForgotPassword: () => void;
  disabled?: boolean;
}

const PasswordField = ({ 
  password, 
  setPassword, 
  onForgotPassword, 
  disabled 
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="password">Senha</Label>
        <Button 
          type="button" 
          variant="link" 
          className="p-0 h-auto text-sm text-bestcode-600 hover:text-bestcode-800"
          onClick={onForgotPassword}
          disabled={disabled}
        >
          Esqueceu a senha?
        </Button>
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input 
          id="password" 
          type={showPassword ? "text" : "password"}
          placeholder="••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10"
          required
          disabled={disabled}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
          onClick={togglePasswordVisibility}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
          <span className="sr-only">
            {showPassword ? "Ocultar senha" : "Mostrar senha"}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default PasswordField;
