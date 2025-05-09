import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreditCardFormProps {
  cardData: {
    cardName: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvc: string;
  };
  handleCardInputChange: (field: string, value: string) => void;
  installments: number;
  finalPrice: number;
}

// Este componente não é mais utilizado, mantido apenas para compatibilidade
const CreditCardForm: React.FC<CreditCardFormProps> = ({ 
  cardData, 
  handleCardInputChange,
  installments,
  finalPrice
}) => {
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{2})(\d+)/, '$1/$2')
      .slice(0, 5);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md mb-4">
        <p className="font-medium">Este método de pagamento foi desativado</p>
        <p className="text-sm mt-1">Por favor, utilize o Stripe Checkout para pagamentos.</p>
      </div>
      
      <div>
        <Label htmlFor="cardName">Nome no cartão</Label>
        <Input
          id="cardName"
          placeholder="Nome como aparece no cartão"
          value={cardData.cardName}
          onChange={(e) => handleCardInputChange("cardName", e.target.value)}
          className="mt-1"
          disabled={true}
        />
      </div>
      
      <div>
        <Label htmlFor="cardNumber">Número do cartão</Label>
        <Input
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={cardData.cardNumber}
          onChange={(e) => handleCardInputChange("cardNumber", formatCardNumber(e.target.value))}
          maxLength={19}
          className="mt-1"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cardExpiry">Data de validade</Label>
          <Input
            id="cardExpiry"
            placeholder="MM/AA"
            value={cardData.cardExpiry}
            onChange={(e) => handleCardInputChange("cardExpiry", formatExpiry(e.target.value))}
            maxLength={5}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="cardCvc">Código de segurança (CVC)</Label>
          <Input
            id="cardCvc"
            placeholder="123"
            value={cardData.cardCvc}
            onChange={(e) => handleCardInputChange("cardCvc", e.target.value.slice(0, 3))}
            maxLength={3}
            type="password"
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="installments">Parcelamento</Label>
        <Select onValueChange={(value) => console.log(value)} disabled={true}>
          <SelectTrigger id="installments" className="mt-1">
            <SelectValue placeholder="Selecione o parcelamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">À vista - R$ {finalPrice.toFixed(2)}</SelectItem>
            {Array.from({ length: installments - 1 }, (_, i) => i + 2).map((i) => (
              <SelectItem key={i} value={i.toString()}>
                {i}x de R$ {(finalPrice / i).toFixed(2)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CreditCardForm;
