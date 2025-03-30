
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CardDataType {
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

interface CreditCardFormProps {
  cardData: CardDataType;
  handleCardInputChange: (field: string, value: string) => void;
  installments: number;
  finalPrice: number;
}

const CreditCardForm = ({ 
  cardData, 
  handleCardInputChange, 
  installments, 
  finalPrice 
}: CreditCardFormProps) => {
  return (
    <div className="space-y-4 border border-gray-200 rounded-md p-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="card-name">Nome no cartão</Label>
        <Input 
          id="card-name" 
          placeholder="Como está impresso no cartão" 
          required 
          mask={/^[A-Za-z\s]+$/}
          value={cardData.cardName}
          onAccept={(value) => handleCardInputChange('cardName', value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="card-number">Número do cartão</Label>
        <Input 
          id="card-number" 
          placeholder="0000 0000 0000 0000" 
          required 
          mask="0000 0000 0000 0000"
          value={cardData.cardNumber}
          onAccept={(value) => handleCardInputChange('cardNumber', value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="card-expiry">Data de validade</Label>
          <Input 
            id="card-expiry" 
            placeholder="MM/AA" 
            required 
            mask="00/00"
            value={cardData.cardExpiry}
            onAccept={(value) => handleCardInputChange('cardExpiry', value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="card-cvc">Código de segurança</Label>
          <Input 
            id="card-cvc" 
            placeholder="CVC" 
            required 
            mask="000"
            value={cardData.cardCvc}
            onAccept={(value) => handleCardInputChange('cardCvc', value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="installments">Parcelas</Label>
        <select 
          id="installments" 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="1">À vista - R$ {finalPrice.toFixed(2)}</option>
          {[...Array(installments)].map((_, i) => (
            <option key={i} value={i+1}>
              {i+1}x de R$ {(finalPrice / (i+1)).toFixed(2)}
              {i > 0 ? " sem juros" : ""}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CreditCardForm;
