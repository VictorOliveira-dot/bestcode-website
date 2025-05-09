
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard } from "lucide-react";

interface PaymentOptionsProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
}

const PaymentOptions = ({ paymentMethod, setPaymentMethod }: PaymentOptionsProps) => {
  return (
    <RadioGroup
      value={paymentMethod}
      onValueChange={setPaymentMethod}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="checkout" id="checkout" />
        <Label htmlFor="checkout" className="flex items-center gap-2 cursor-pointer">
          <CreditCard size={18} />
          <span>Stripe Checkout (Cartão de Crédito / Débito)</span>
        </Label>
      </div>
    </RadioGroup>
  );
};

export default PaymentOptions;
