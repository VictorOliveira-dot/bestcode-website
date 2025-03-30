
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PaymentOptions from "./PaymentOptions";
import CreditCardForm from "./CreditCardForm";
import BankSlipInfo from "./BankSlipInfo";
import PixInfo from "./PixInfo";

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
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentOptions 
        paymentMethod={paymentMethod} 
        setPaymentMethod={setPaymentMethod} 
      />

      {paymentMethod === "credit-card" && (
        <CreditCardForm 
          cardData={cardData}
          handleCardInputChange={handleCardInputChange}
          installments={course.installments}
          finalPrice={course.finalPrice}
        />
      )}

      {paymentMethod === "bank-slip" && <BankSlipInfo />}

      {paymentMethod === "pix" && <PixInfo />}

      <Button 
        type="submit" 
        className="w-full bg-bestcode-600 hover:bg-bestcode-700 mt-6" 
        size="lg"
        disabled={isProcessing}
      >
        {isProcessing ? "Processando..." : "Finalizar Compra"}
      </Button>
      
      <p className="text-sm text-gray-500 text-center mt-4">
        Ao finalizar sua compra, você concorda com nossos{" "}
        <Link to="/terms" className="text-bestcode-600 hover:text-bestcode-800">
          termos de serviço
        </Link>
      </p>
    </form>
  );
};

export default PaymentForm;
