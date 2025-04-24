
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./contexts/auth";
import App from "./App";
import { supabase } from "./integrations/supabase/client";

const AppWithAuth = () => {
  // Instancia o QueryClient dentro do componente
  const queryClient = new QueryClient();
  
  // Ensure we clear any existing auth session when the app loads
  useEffect(() => {
    const clearSession = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error clearing session on app initialization:", error);
      }
    };
    
    clearSession();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <App />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AppWithAuth;
