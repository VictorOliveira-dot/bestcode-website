
import { useState, useEffect } from "react";
import { ClassInfo } from "@/components/teacher/ClassItem";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";

export interface ClassTableProps {
  classes: ClassInfo[];
  openEditDialog: (classInfo: ClassInfo) => void;
  handleDeleteClass: (id: string) => void;
  isLoading?: boolean;
}

export function useClassTable(props: ClassTableProps) {
  const { classes, isLoading = false } = props;
  const isMobile = useIsMobile();
  const [error, setError] = useState<string | null>(null);
  
  // Reset error state when classes load successfully
  useEffect(() => {
    if (classes.length > 0 && error) {
      setError(null);
    }
  }, [classes, error]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar turmas",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);
  
  return {
    classes,
    isLoading,
    isMobile,
    isEmpty: classes.length === 0 && !isLoading,
    error,
    setError
  };
}
