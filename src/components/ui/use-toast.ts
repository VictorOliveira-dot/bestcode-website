
// Re-export the toast hook and toast function from Sonner
import { toast as sonnerToast } from "sonner";

// Create a wrapper for sonnerToast that accepts our application's expected parameters
export const toast = (params: {
  variant?: "default" | "destructive",
  title?: string,
  description?: string
}) => {
  const { variant, title, description } = params;

  return sonnerToast(title, {
    description,
    // Map our variant to sonner's style
    style: variant === "destructive" ? { backgroundColor: "#fef2f2", borderColor: "#f87171", color: "#b91c1c" } : undefined
  });
};

export const useToast = () => {
  return {
    toast
  };
};
