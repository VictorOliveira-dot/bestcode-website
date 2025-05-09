
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Landmark, Clock } from "lucide-react";

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

      <div className="flex items-center space-x-2">
        <RadioGroupItem value="credit-card" id="credit-card" />
        <Label htmlFor="credit-card" className="flex items-center gap-2 cursor-pointer">
          <CreditCard size={18} />
          <span>Cartão de Crédito Manual</span>
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <RadioGroupItem value="pix" id="pix" />
        <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer">
          <span className="font-bold text-base">PIX</span>
          <span>Pagamento Instantâneo</span>
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <RadioGroupItem value="bank-slip" id="bank-slip" />
        <Label htmlFor="bank-slip" className="flex items-center gap-2 cursor-pointer">
          <Landmark size={18} />
          <span>Boleto Bancário</span>
        </Label>
      </div>
    </RadioGroup>
  );
};

export default PaymentOptions;
