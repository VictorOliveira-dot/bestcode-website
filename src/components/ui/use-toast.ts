
// Re-export the toast hook and toast function from Sonner
import { toast as sonnerToast } from "sonner";

export const useToast = () => {
  return {
    toast: sonnerToast,
  };
};

export const toast = sonnerToast;
