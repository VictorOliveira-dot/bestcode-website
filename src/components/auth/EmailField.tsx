
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

interface EmailFieldProps {
  email: string;
  setEmail: (value: string) => void;
  disabled?: boolean;
}

const EmailField = ({ email, setEmail, disabled }: EmailFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">E-mail</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input 
          id="email" 
          type="email" 
          placeholder="seu@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10"
          required
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default EmailField;
