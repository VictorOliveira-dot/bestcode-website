
import { toast } from "@/hooks/use-toast";

/**
 * Validates class data before creation or update
 * @returns True if data is valid, false otherwise
 */
export const validateClassData = (
  classData: {
    name: string;
    description: string;
    startDate: string;
  }
): boolean => {
  if (!classData.name || !classData.description || !classData.startDate) {
    toast({
      title: "Campos obrigatórios",
      description: "Preencha todos os campos obrigatórios.",
      variant: "destructive"
    });
    return false;
  }
  
  return true;
};
