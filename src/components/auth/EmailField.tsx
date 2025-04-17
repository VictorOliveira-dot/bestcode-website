
import React from "react";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { Mail } from "lucide-react";

interface EmailFieldProps {
  control?: Control<any>;
  // Add the following props to match what LoginForm is trying to pass
  email?: string;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
}

const EmailField = ({ control, email, setEmail, disabled }: EmailFieldProps) => {
  // If we're using react-hook-form (control is provided)
  if (control) {
    return (
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-mail</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  className="pl-10"
                  disabled={disabled}
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  
  // If we're using controlled inputs (email and setEmail are provided)
  return (
    <div className="space-y-2">
      <label htmlFor="email" className="text-sm font-medium">E-mail</label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input 
          id="email" 
          type="email" 
          placeholder="seu@email.com" 
          className="pl-10"
          value={email || ""}
          onChange={(e) => setEmail && setEmail(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default EmailField;
