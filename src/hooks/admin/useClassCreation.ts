
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { ClassFormValues } from "@/components/admin/class/ClassForm";
import { supabase } from "@/integrations/supabase/client";

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
      
      // Call the admin_create_class function to create the class
      const { data: classId, error } = await supabase.rpc('admin_create_class', {
        p_name: data.name,
        p_description: data.description,
        p_start_date: data.startDate,
        p_teacher_id: data.teacherId
      });
      
      if (error) {
        throw new Error(error.message || "Failed to create class");
      }
      
      toast({
        title: "Class created",
        description: `${data.name} has been created successfully.`,
      });

      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error: any) {
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
