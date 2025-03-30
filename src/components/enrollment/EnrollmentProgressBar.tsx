
import React from "react";

interface EnrollmentProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const EnrollmentProgressBar: React.FC<EnrollmentProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">
          Etapa {currentStep} de {totalSteps}
        </div>
        <div className="text-sm text-gray-500">
          {currentStep === 1 && "Informações Pessoais"}
          {currentStep === 2 && "Documentação"}
          {currentStep === 3 && "Preferências de Estudo"}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-bestcode-600 h-2.5 rounded-full transition-all" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default EnrollmentProgressBar;
