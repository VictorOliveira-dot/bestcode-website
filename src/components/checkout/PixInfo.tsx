
import React from "react";
import { CheckCircle2 } from "lucide-react";

const PixInfo = () => {
  return (
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
  );
};

export default PixInfo;
