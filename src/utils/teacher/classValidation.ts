
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
  if (!classData.name) {
    toast({
      title: "Campo obrigatório",
      description: "O nome da turma é obrigatório.",
      variant: "destructive"
    });
    return false;
  }
  
  if (!classData.description) {
    toast({
      title: "Campo obrigatório",
      description: "A descrição da turma é obrigatória.",
      variant: "destructive"
    });
    return false;
  }
  
  if (!classData.startDate) {
    toast({
      title: "Campo obrigatório",
      description: "A data de início é obrigatória.",
      variant: "destructive"
    });
    return false;
  }
  
  return true;
};
