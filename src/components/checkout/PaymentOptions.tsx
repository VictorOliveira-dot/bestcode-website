
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard } from "lucide-react";

interface PaymentOptionsProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
}

const PaymentOptions = ({ paymentMethod, setPaymentMethod }: PaymentOptionsProps) => {
  // Definir 'checkout' automaticamente como o método de pagamento no carregamento do componente
  React.useEffect(() => {
    setPaymentMethod("checkout");
  }, [setPaymentMethod]);

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md mb-4">
        <p className="text-sm font-medium">Pagamento seguro via Stripe</p>
        <p className="text-xs mt-1">Aceitamos todos os cartões de crédito e débito mais populares.</p>
      </div>
      
      <RadioGroup
        value={paymentMethod}
        onValueChange={setPaymentMethod}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="checkout" id="checkout" checked disabled />
          <Label htmlFor="checkout" className="flex items-center gap-2 cursor-pointer">
            <CreditCard size={18} />
            <span>Stripe Checkout (Cartão de Crédito / Débito)</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentOptions;
