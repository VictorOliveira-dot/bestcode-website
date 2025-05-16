
import React from "react";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";

interface CreditCardFormProps {
  cardData: {
    cardName: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvc: string;
  };
  handleCardInputChange: (field: string, value: string) => void;
  installments: number;
  finalPrice?: number;
  showInstallments?: boolean;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ 
  finalPrice = 0,
  showInstallments = false
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md mb-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard size={20} />
          <p className="font-medium">Pagamento via Stripe Checkout</p>
        </div>
        <p className="text-sm">
          Ao prosseguir, você será redirecionado para o Stripe Checkout, onde poderá inserir seus dados de pagamento de forma segura.
        </p>
        {showInstallments && (
          <p className="text-sm mt-2">
            Você poderá escolher parcelar em até 12x de R$ {(finalPrice / 12).toFixed(2)} durante o checkout.
          </p>
        )}
      </div>
      
      <div className="text-center p-4">
        <p className="font-semibold">
          Total a pagar: R$ {finalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};

export default CreditCardForm;
