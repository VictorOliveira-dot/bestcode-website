
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Landmark, 
  Clock,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
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
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                  <CardDescription>Detalhes do curso selecionado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="font-medium text-lg">{course.title}</div>
                    <div className="text-sm text-gray-500">Acesso por 12 meses</div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preço original</span>
                      <span>R$ {course.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>- R$ {course.discount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>R$ {course.finalPrice.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                      ou {course.installments}x de R$ {course.installmentPrice.toFixed(2)}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md w-full">
                    <ShieldCheck size={18} className="text-bestcode-600" />
                    <span>Pagamento 100% seguro e criptografado</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-green-600" />
                    <span>7 dias de garantia de satisfação</span>
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Pagamento</CardTitle>
                  <CardDescription>Escolha seu método de pagamento preferido</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="flex items-center gap-2 cursor-pointer">
                          <CreditCard size={18} />
                          <span>Cartão de Crédito</span>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bank-slip" id="bank-slip" />
                        <Label htmlFor="bank-slip" className="flex items-center gap-2 cursor-pointer">
                          <Landmark size={18} />
                          <span>Boleto Bancário</span>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer">
                          <span className="font-bold text-base">PIX</span>
                          <span>Pagamento Instantâneo</span>
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "credit-card" && (
                      <div className="space-y-4 border border-gray-200 rounded-md p-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-name">Nome no cartão</Label>
                          <Input id="card-name" placeholder="Como está impresso no cartão" required />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="card-number">Número do cartão</Label>
                          <Input id="card-number" placeholder="0000 0000 0000 0000" required />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="card-expiry">Data de validade</Label>
                            <Input id="card-expiry" placeholder="MM/AA" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="card-cvc">Código de segurança</Label>
                            <Input id="card-cvc" placeholder="CVC" required />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="installments">Parcelas</Label>
                          <select 
                            id="installments" 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="1">À vista - R$ {course.finalPrice.toFixed(2)}</option>
                            {[...Array(course.installments)].map((_, i) => (
                              <option key={i} value={i+1}>
                                {i+1}x de R$ {(course.finalPrice / (i+1)).toFixed(2)}
                                {i > 0 ? " sem juros" : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "bank-slip" && (
                      <div className="border border-gray-200 rounded-md p-4 mt-4">
                        <div className="flex items-center gap-3 mb-4">
                          <Clock size={20} className="text-amber-500" />
                          <p className="text-gray-700">
                            O boleto tem prazo de 3 dias úteis para compensação após o pagamento.
                          </p>
                        </div>
                        <p className="text-gray-600">
                          Ao clicar em "Finalizar Compra", você receberá o boleto para pagamento por e-mail.
                        </p>
                      </div>
                    )}

                    {paymentMethod === "pix" && (
                      <div className="border border-gray-200 rounded-md p-4 mt-4">
                        <div className="flex items-center gap-3 mb-4">
                          <CheckCircle2 size={20} className="text-green-500" />
                          <p className="text-gray-700">
                            Pagamento instantâneo via PIX.
                          </p>
                        </div>
                        <p className="text-gray-600">
                          Ao clicar em "Finalizar Compra", você receberá um QR Code para fazer o pagamento.
                        </p>
                      </div>
                    )}

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
