
import React from "react";
import { QrCode } from "lucide-react";

const PixInfo: React.FC = () => {
  return (
    <div className="text-center p-4 border border-gray-200 rounded-md">
      <div className="flex justify-center mb-3">
        <QrCode size={48} className="text-bestcode-600" />
      </div>
      <h3 className="text-lg font-medium mb-2">Pagamento via PIX</h3>
      <p className="text-gray-600">
        Ao confirmar, você receberá um código QR para fazer o pagamento via PIX.
        O pagamento será processado instantaneamente.
      </p>
    </div>
  );
};

export default PixInfo;
