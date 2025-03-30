
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EnrollmentFormNavProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
}

const EnrollmentFormNav: React.FC<EnrollmentFormNavProps> = ({
  currentStep,
  totalSteps,
  isSubmitting,
  goToPreviousStep,
  goToNextStep,
}) => {
  return (
    <div className="flex justify-between pt-4">
      {currentStep > 1 ? (
        <Button 
          type="button" 
          variant="outline" 
          onClick={goToPreviousStep}
          disabled={isSubmitting}
        >
          <ChevronLeft className="mr-1" size={16} />
          Voltar
        </Button>
      ) : (
        <div></div>
      )}
      
      {currentStep < totalSteps ? (
        <Button 
          type="button" 
          onClick={goToNextStep}
          className="bg-bestcode-600 hover:bg-bestcode-700"
        >
          Próximo
          <ChevronRight className="ml-1" size={16} />
        </Button>
      ) : (
        <Button 
          type="submit" 
          className="bg-bestcode-600 hover:bg-bestcode-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Finalizando..." : "Finalizar Matrícula"}
        </Button>
      )}
    </div>
  );
};

export default EnrollmentFormNav;
