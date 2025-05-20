
import React from "react";
import { Label } from "@/components/ui/label";
import { CreditCard, AlertCircle } from "lucide-react";

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
      <div className="bg-amber-50 border-2 border-amber-300 text-amber-800 p-4 rounded-md mb-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={20} className="text-amber-600" />
          <p className="font-medium">MODO DE TESTE</p>
        </div>
        <p className="text-sm">
          Este é um ambiente de teste. Nenhum pagamento real será processado.
        </p>
      </div>
    
      <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md mb-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard size={20} />
          <p className="font-medium">Pagamento via Stripe Checkout (Modo de Teste)</p>
        </div>
        <p className="text-sm">
          Ao prosseguir, você será redirecionado para o Stripe Checkout, onde poderá inserir seus dados de pagamento de forma segura.
        </p>
        {showInstallments && (
          <p className="text-sm mt-2">
            Você poderá escolher parcelar em até 12x de R$ {(finalPrice / 12).toFixed(2)} durante o checkout.
          </p>
        )}
        
        <div className="mt-3 bg-gray-100 p-2 rounded-md border border-gray-200">
          <p className="text-sm flex items-center gap-1 font-medium">
            <AlertCircle size={16} className="text-amber-500" />
            Cartões de teste:
          </p>
          <ul className="text-xs mt-1 space-y-1 pl-5 list-disc">
            <li>Visa: <span className="font-mono">4242 4242 4242 4242</span></li>
            <li>Mastercard: <span className="font-mono">5555 5555 5555 4444</span></li>
            <li>Para PIX, use qualquer CPF válido</li>
            <li>Para Boleto, qualquer CPF válido será aceito</li>
          </ul>
        </div>
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
