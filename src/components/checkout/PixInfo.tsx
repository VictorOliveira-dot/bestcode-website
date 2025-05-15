
import React from "react";
import { QrCode } from "lucide-react";

interface PixInfoProps {
  price: number;
}

const PixInfo: React.FC<PixInfoProps> = ({ price }) => {
  return (
    <div className="text-center p-4 border border-gray-200 rounded-md">
      <div className="flex justify-center mb-3">
        <QrCode size={48} className="text-bestcode-600" />
      </div>
      <h3 className="text-lg font-medium mb-2">Pagamento via PIX</h3>
      <p className="text-gray-600">
        Ao finalizar o pagamento, você receberá um código PIX para pagamento imediato.
        Seu acesso à plataforma será liberado automaticamente após confirmação.
      </p>
      <p className="font-semibold mt-3">
        Total a pagar: R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
};

export default PixInfo;
