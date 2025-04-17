
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordFieldProps {
  control?: Control<any>;
  password?: string;
  setPassword?: React.Dispatch<React.SetStateAction<string>>;
  onForgotPassword?: () => void;
  disabled?: boolean;
}

const PasswordField = ({ control, password, setPassword, onForgotPassword, disabled }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // If we're using react-hook-form (control is provided)
  if (control) {
    return (
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Senha</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••" 
                  className="pl-10"
                  disabled={disabled}
                  {...field}
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  
  // If we're using controlled inputs (password and setPassword are provided)
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor="password" className="text-sm font-medium">Senha</label>
        {onForgotPassword && (
          <Button
            type="button"
            variant="link"
            className="text-xs p-0 h-auto"
            onClick={onForgotPassword}
          >
            Esqueceu a senha?
          </Button>
        )}
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input 
          id="password" 
          type={showPassword ? "text" : "password"}
          placeholder="••••••••" 
          className="pl-10"
          value={password || ""}
          onChange={(e) => setPassword && setPassword(e.target.value)}
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
