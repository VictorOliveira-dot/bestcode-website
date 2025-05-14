
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Banknote, QrCode, Receipt } from "lucide-react";

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
        <RadioGroupItem value="pix" id="pix" />
        <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer">
          <QrCode size={18} />
          <span>PIX à vista (R$4.000 - com desconto)</span>
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <RadioGroupItem value="credit-full" id="credit-full" />
        <Label htmlFor="credit-full" className="flex items-center gap-2 cursor-pointer">
          <CreditCard size={18} />
          <span>Cartão de Crédito à vista (R$4.000)</span>
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <RadioGroupItem value="credit-installments" id="credit-installments" />
        <Label htmlFor="credit-installments" className="flex items-center gap-2 cursor-pointer">
          <CreditCard size={18} />
          <span>Cartão de Crédito parcelado (até 12x de R$374,91)</span>
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <RadioGroupItem value="boleto" id="boleto" />
        <Label htmlFor="boleto" className="flex items-center gap-2 cursor-pointer">
          <Receipt size={18} />
          <span>Boleto parcelado (até 12x de R$374,91)</span>
        </Label>
      </div>
    </RadioGroup>
  );
};

export default PaymentOptions;
