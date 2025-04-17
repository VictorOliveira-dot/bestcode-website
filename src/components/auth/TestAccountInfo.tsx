
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const TestAccountInfo = () => {
  return (
    <div className="mt-4">
      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <Info className="h-4 w-4 mr-2" />
        <AlertDescription className="text-xs">
          <strong>Registration Information:</strong>
          <div className="mt-1">
            Create a new account by registering. All new accounts are created as student accounts by default.
            To create teacher accounts, an admin account is needed.
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default TestAccountInfo;
