
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
      {/* <div className="bg-red-50 border-2 border-red-300 text-red-800 p-4 rounded-md mb-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={20} className="text-red-600" />
          <p className="font-medium text-red-600">AMBIENTE DE TESTE STRIPE</p>
        </div>
        <p className="text-sm">
          Este é um ambiente de teste. Nenhum pagamento real será processado.
        </p>
        <p className="text-sm mt-2 font-bold">
          IMPORTANTE: Use apenas os cartões de teste listados abaixo ou ocorrerá um erro!
        </p>
      </div> */}
    
      <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md mb-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard size={20} />
          <p className="font-medium">Teste com a Stripe</p>
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
            <AlertCircle size={16} className="text-red-500" />
            SOMENTE CARTÕES DE TESTE:
          </p>
          <ul className="text-xs mt-1 space-y-1 pl-5 list-disc">
            <li>Visa (sucesso): <span className="font-mono font-bold">4242 4242 4242 4242</span></li>
            <li>Mastercard (sucesso): <span className="font-mono font-bold">5555 5555 5555 4444</span></li>
            <li>Para PIX, use qualquer CPF válido</li>
            <li>Para Boleto, qualquer CPF válido será aceito</li>
            <li className="text-red-500 font-semibold">NÃO use cartões reais - apenas os cartões de teste acima!</li>
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
