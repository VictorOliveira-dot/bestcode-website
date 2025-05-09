
import React from "react";
import { FileText } from "lucide-react";

const BankSlipInfo: React.FC = () => {
  return (
    <div className="text-center p-4 border border-gray-200 rounded-md">
      <div className="flex justify-center mb-3">
        <FileText size={48} className="text-bestcode-600" />
      </div>
      <h3 className="text-lg font-medium mb-2">Pagamento via Boleto</h3>
      <p className="text-gray-600">
        Ao confirmar, você receberá um boleto bancário para pagamento.
        A compensação do boleto pode levar até 3 dias úteis.
      </p>
      <p className="text-gray-600 mt-2 text-sm">
        Após o pagamento, seu acesso será automaticamente liberado.
      </p>
    </div>
  );
};

export default BankSlipInfo;
