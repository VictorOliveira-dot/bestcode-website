import React, { forwardRef } from "react";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface MaskedInputProps extends Omit<InputProps, 'onChange'> {
  mask: 'cpf' | 'phone' | 'cep';
  value?: string;
  onChange?: (value: string) => void;
}

const applyMask = (value: string, mask: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  
  switch (mask) {
    case 'cpf':
      return cleanValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    case 'phone':
      if (cleanValue.length <= 10) {
        return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
    case 'cep':
      return cleanValue.replace(/(\d{5})(\d{3})/, '$1-$2');
    default:
      return cleanValue;
  }
};

const getMaxLength = (mask: string): number => {
  switch (mask) {
    case 'cpf':
      return 14;
    case 'phone':
      return 15;
    case 'cep':
      return 9;
    default:
      return undefined;
  }
};

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, mask, value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const maskedValue = applyMask(e.target.value, mask);
      onChange?.(maskedValue);
    };

    return (
      <Input
        className={cn(className)}
        ref={ref}
        value={value}
        onChange={handleChange}
        maxLength={getMaxLength(mask)}
        {...props}
      />
    );
  }
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };