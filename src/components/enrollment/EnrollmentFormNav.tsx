
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface EnrollmentFormNavProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  goToPreviousStep: () => void;
  onNextClick: (e: React.FormEvent) => void;
}

const EnrollmentFormNav: React.FC<EnrollmentFormNavProps> = ({
  currentStep,
  totalSteps,
  isSubmitting,
  goToPreviousStep,
  onNextClick,
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
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
      ) : (
        <div></div>
      )}
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        onClick={onNextClick}
      >
        {currentStep === totalSteps ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Finalizar
          </>
        ) : (
          <>
            Próximo
            <ChevronRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default EnrollmentFormNav;
