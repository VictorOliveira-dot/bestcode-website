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
      console.log('Iniciando processo de logout...');
      
      const result = await logout();
      
      if (result.success) {
        toast({
          title: "Logout realizado com sucesso",
          description: "Redirecionando para tela de login...",
          variant: "default",
        });
        
        // Clear all possible auth-related data
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
        
        // Force immediate redirect
        window.location.replace("/login");
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Erro no logout:', error);
      
      // Force logout even if there are errors
      toast({
        title: "Forçando saída do sistema",
        description: "Limpando dados e redirecionando...",
        variant: "default",
      });
      
      // Clear all local data and force redirect as fallback
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (storageError) {
        console.error('Erro ao limpar storage:', storageError);
      }
      
      window.location.replace("/login");
    } finally {
      setIsLoggingOut(false);
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