
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup } from "@/components/ui/radio-group";
import CreditCardForm from "./CreditCardForm";
import PixInfo from "./PixInfo";
import BankSlipInfo from "./BankSlipInfo";
import PaymentOptions from "./PaymentOptions";
import { toast } from "@/components/ui/use-toast";
import { AlertTriangle } from "lucide-react";

interface PaymentFormProps {
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  cardData: {
    cardName: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvc: string;
  };
  handleCardInputChange: (field: string, value: string) => void;
  course: {
    title: string;
    price: number;
    discount: number;
    finalPrice: number;
    installments: number;
    installmentPrice: number;
  };
  isProcessing: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

const PaymentForm = ({
  paymentMethod,
  setPaymentMethod,
  cardData,
  handleCardInputChange,
  course,
  isProcessing,
  handleSubmit,
}: PaymentFormProps) => {

  const validateForm = (): boolean => {
    if (paymentMethod === '') {
      toast({
        title: "Selecione um método de pagamento",
        description: "Por favor, escolha uma forma de pagamento para continuar",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // console.log("Form validated, submitting payment with method:", paymentMethod);
    handleSubmit(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Test Mode Banner - Always visible in this implementation */}
      <div className="bg-amber-100 border border-amber-300 p-3 rounded-md flex items-center gap-2 text-amber-800">
        <AlertTriangle size={18} />
        <span className="text-sm">
          <strong>Modo de teste:</strong> Use o cartão 4242 4242 4242 4242, qualquer data futura e qualquer CVC.
        </span>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">Método de pagamento</Label>
        
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => {
            // console.log("Payment method selected:", value);
            setPaymentMethod(value);
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <PaymentOptions 
            paymentMethod={paymentMethod} 
            setPaymentMethod={setPaymentMethod} 
          />
        </RadioGroup>
      </div>

      <Separator />

      {/* Payment method specific details */}
      {(paymentMethod === "credit-full" || paymentMethod === "credit-installments") && (
        <CreditCardForm
          cardData={cardData}
          handleCardInputChange={handleCardInputChange}
          installments={course.installments}
          finalPrice={course.finalPrice}
          showInstallments={paymentMethod === "credit-installments"}
        />
      )}

      {paymentMethod === "pix" && <PixInfo price={course.finalPrice} />}
      
      {paymentMethod === "boleto" && <BankSlipInfo price={course.finalPrice} />}

      <Button
        type="submit"
        disabled={isProcessing}
        className="w-full font-semibold py-6 text-lg"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processando...
          </>
        ) : (
          `Prosseguir para pagamento - R$ ${course.finalPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
        )}
      </Button>
    </form>
  );
};

export default PaymentForm;
