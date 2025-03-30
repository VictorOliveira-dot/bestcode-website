
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, ShieldCheck } from "lucide-react";

interface CourseType {
  title: string;
  price: number;
  discount: number;
  finalPrice: number;
  installments: number;
  installmentPrice: number;
}

interface OrderSummaryProps {
  course: CourseType;
}

const OrderSummary = ({ course }: OrderSummaryProps) => {
  return (
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
          <ShieldCheck size={18} className="text-gray-800" />
          <span>Pagamento 100% seguro e criptografado</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle2 size={16} className="text-green-600" />
          <span>7 dias de garantia de satisfação</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;
