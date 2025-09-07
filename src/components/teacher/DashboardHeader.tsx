
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      console.log('Iniciando logout do dashboard...');
      
      const result = await logout();
      
      if (result.success) {
        toast({
          title: "Logout realizado com sucesso",
          description: "Redirecionando para tela de login...",
          variant: "default",
        });
        
        // Force immediate redirect without delay
        window.location.replace("/login");
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Erro no logout:', error);
      
      // Force logout even if there are errors
      toast({
        title: "Forçando saída...",
        description: "Limpando dados e redirecionando...",
        variant: "default",
      });
      
      // Clear all local data and force redirect
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/login");
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-border shadow-sm sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img 
              src="/img/logotipo/logotipoBestCode.png" 
              alt="Code Academy" 
              className="h-8 flex-shrink-0" 
            />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary truncate">
              <span className="hidden sm:inline">Painel do {userName}</span>
              <span className="sm:hidden">Dashboard</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden md:inline text-sm text-muted-foreground">
              Olá, {userName}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile/edit')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Editar Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
