
import { useState, useEffect } from "react";
import { ClassInfo } from "@/components/teacher/ClassItem";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";

export interface ClassTableProps {
  classes: ClassInfo[];
  openEditDialog: (classInfo: ClassInfo) => void;
  handleDeleteClass: (id: string) => void;
  isLoading?: boolean;
  error?: string | null;
  refetch?: () => void;
}

export function useClassTable(props: ClassTableProps) {
  const { classes, isLoading = false, error: externalError = null, refetch } = props;
  const isMobile = useIsMobile();
  const [error, setError] = useState<string | null>(externalError);
  
  // Update error state when external error changes
  useEffect(() => {
    if (externalError !== null) {
      setError(externalError);
    }
  }, [externalError]);
  
  // Reset error state when classes load successfully
  useEffect(() => {
    if (classes && error) {
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
    isEmpty: !isLoading && (!classes || classes.length === 0),
    error,
    setError,
    refetch
  };
}
