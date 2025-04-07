
import { useState } from "react";
import { ClassInfo } from "@/components/teacher/ClassItem";
import { useIsMobile } from "@/hooks/use-mobile";

export interface ClassTableProps {
  classes: ClassInfo[];
  openEditDialog: (classInfo: ClassInfo) => void;
  handleDeleteClass: (id: string) => void;
  isLoading?: boolean;
}

export function useClassTable(props: ClassTableProps) {
  const { classes, isLoading = false } = props;
  const isMobile = useIsMobile();
  
  return {
    classes,
    isLoading,
    isMobile,
    isEmpty: classes.length === 0 && !isLoading
  };
}
