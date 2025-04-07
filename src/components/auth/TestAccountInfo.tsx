
import React from "react";
import { Card } from "@/components/ui/card";

const TestAccountInfo = () => {
  return (
    <Card className="p-4 mt-6 bg-gray-50 border border-gray-200">
      <div className="text-sm">
        <h3 className="font-medium text-gray-900 mb-2">Contas para teste:</h3>
        <div className="space-y-2">
          <div>
            <p className="font-medium text-gray-700">Professor:</p>
            <p>Email: professor@bestcode.com</p>
            <p>Senha: teacher123</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Aluno:</p>
            <p>Email: aluno@bestcode.com</p>
            <p>Senha: student123</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Administrador:</p>
            <p>Email: admin@bestcode.com</p>
            <p>Senha: admin123</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TestAccountInfo;
