
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PaymentOptions from "./PaymentOptions";
import CreditCardForm from "./CreditCardForm";
import BankSlipInfo from "./BankSlipInfo";
import PixInfo from "./PixInfo";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

interface CardDataType {
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

interface CourseType {
  title: string;
  price: number;
  discount: number;
  finalPrice: number;
  installments: number;
  installmentPrice: number;
}

interface PaymentFormProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  cardData: CardDataType;
  handleCardInputChange: (field: string, value: string) => void;
  course: CourseType;
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
  handleSubmit
}: PaymentFormProps) => {
  const [acceptTerms, setAcceptTerms] = React.useState(false);

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast({
        variant: "destructive",
        title: "Termos não aceitos",
        description: "Você precisa aceitar os termos de serviço para continuar."
      });
      return;
    }
    
    handleSubmit(e);
  };

  return (
    <form onSubmit={validateAndSubmit} className="space-y-6">
      <PaymentOptions 
        paymentMethod={paymentMethod} 
        setPaymentMethod={setPaymentMethod} 
      />

      {(paymentMethod === "credit-full" || paymentMethod === "credit-installments") && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md">
          <p className="font-medium">Você será redirecionado para o Stripe Checkout</p>
          <p className="text-sm mt-1">Complete o pagamento de forma segura diretamente no ambiente do Stripe.</p>
        </div>
      )}

      {paymentMethod === "boleto" && <BankSlipInfo />}

      {paymentMethod === "pix" && <PixInfo />}

      <div className="flex items-center space-x-2 mt-4">
        <Checkbox 
          id="terms" 
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked === true)}
          required
        />
        <label
          htmlFor="terms"
          className="text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Aceito os{" "}
          <Link to="/terms" className="text-bestcode-600 hover:text-bestcode-800">
            termos de serviço
          </Link>{" "}
          e a{" "}
          <Link to="/privacy" className="text-bestcode-600 hover:text-bestcode-800">
            política de privacidade
          </Link>
        </label>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-bestcode-600 hover:bg-bestcode-700 mt-6" 
        size="lg"
        disabled={isProcessing || !acceptTerms}
      >
        {isProcessing ? "Processando..." : "Finalizar Compra"}
      </Button>
      
      <p className="text-sm text-gray-500 text-center mt-4">
        Pagamento 100% seguro e criptografado
      </p>
    </form>
  );
};

export default PaymentForm;
