
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CreateTestUsers = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createTestUsers = async () => {
    setIsCreating(true);
    try {
      // Call the Supabase function to create test users
      const { data, error } = await supabase.rpc('create_test_users');
      
      if (error) {
        console.error("Error creating test users:", error);
        toast({
          title: "Error creating test users",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      console.log("Test users created:", data);
      toast({
        title: "Success!",
        description: "Test users have been created successfully. You can now login with the test credentials.",
        duration: 5000,
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <Card className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create Test Users</h1>
        <p className="mb-4">
          Click the button below to create test users in your Supabase database. This will create:
        </p>
        <ul className="list-disc pl-5 mb-6 space-y-1">
          <li><strong>Admin:</strong> admin@bestcode.com (Password: Senha123!)</li>
          <li><strong>Teacher:</strong> professor@bestcode.com (Password: Senha123!)</li>
          <li><strong>Student:</strong> aluno@bestcode.com (Password: Senha123!)</li>
        </ul>
        <Button 
          onClick={createTestUsers} 
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? "Creating Users..." : "Create Test Users"}
        </Button>
      </Card>
    </div>
  );
};

export default CreateTestUsers;
