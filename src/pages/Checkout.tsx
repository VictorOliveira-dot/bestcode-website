
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentForm from "@/components/checkout/PaymentForm";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const course = {
    title: "Formação Completa em QA",
    price: 1997.00,
    discount: 200.00,
    finalPrice: 1797.00,
    installments: 12,
    installmentPrice: 149.75
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Show success toast
      toast({
        title: "Pagamento processado com sucesso!",
        description: "Você será redirecionado para completar sua matrícula.",
        variant: "default",
      });
      
      // Redirect to enrollment page
      setTimeout(() => {
        navigate("/enrollment");
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-gray-600 mt-1">Complete sua compra em poucos passos</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <OrderSummary course={course} />
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Pagamento</CardTitle>
                  <CardDescription>Escolha seu método de pagamento preferido</CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentForm 
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    cardData={cardData}
                    handleCardInputChange={handleCardInputChange}
                    course={course}
                    isProcessing={isProcessing}
                    handleSubmit={handleSubmit}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
