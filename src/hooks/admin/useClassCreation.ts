
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { ClassFormValues } from "@/components/admin/class/ClassForm";

export const useClassCreation = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const createClass = async (data: ClassFormValues) => {
    try {
      setIsLoading(true);
      
      if (!user?.id) {
        throw new Error("Not authenticated");
      }
      
      if (user.role !== 'admin') {
        throw new Error("Only admins can create classes");
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Class created",
        description: `${data.name} has been created successfully.`,
      });

      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error: any) {
      console.error("Failed to create class:", error);
      toast({
        title: "Error creating class",
        description: error.message || "There was an error creating the class.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { createClass, isLoading };
};
