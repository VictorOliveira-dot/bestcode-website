
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Save } from "lucide-react";
import { toast } from "sonner";  // Add this import

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
  const handleSaveAndExit = () => {
    // Data is already being saved in localStorage via useEffect in EnrollmentForm
    // toast.success("Seu progresso foi salvo", {
    //   description: "Você pode continuar mais tarde retornando a esta página"
    // });
    
    // Redirect to homepage after 1.5 seconds
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="flex justify-between pt-4">
      <div className="flex space-x-2">
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
      </div>
      
      <div className="flex space-x-2">
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
    </div>
  );
};

export default EnrollmentFormNav;
