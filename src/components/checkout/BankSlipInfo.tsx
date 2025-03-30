
import React from "react";
import { Clock } from "lucide-react";

const BankSlipInfo = () => {
  return (
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
  );
};

export default BankSlipInfo;
