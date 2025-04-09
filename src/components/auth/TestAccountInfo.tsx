
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const TestAccountInfo = () => {
  return (
    <div className="mt-4">
      <Alert className="bg-amber-50 border-amber-200 text-amber-800">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <AlertDescription className="text-xs">
          <strong>Contas de teste:</strong>
          <div className="mt-1 grid gap-1">
            <div><strong>Professor:</strong> professor@bestcode.com / teacher123</div>
            <div><strong>Aluno:</strong> aluno@bestcode.com / student123</div>
            <div><strong>Admin:</strong> admin@bestcode.com / admin123</div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default TestAccountInfo;
