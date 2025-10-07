import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
  className?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  variant = "outline", 
  size = "default",
  children,
  className 
}) => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true);
    
    try {
      
      // Clear all auth data immediately
      localStorage.clear();
      sessionStorage.clear();
      
      const result = await logout();
      
      toast({
        title: "Logout realizado",
        description: "Redirecionando...",
        variant: "default",
      });
      
      // Force immediate redirect without waiting
      window.location.replace("/login");
      
    } catch (error) {
      
      // Force logout even if there are errors
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/login");
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className}
    >
      {isLoggingOut ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
          Saindo...
        </>
      ) : (
        <>
          {children || (
            <>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </>
          )}
        </>
      )}
    </Button>
  );
};