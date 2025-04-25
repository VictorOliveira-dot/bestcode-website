
import React from "react";
import { Button } from "@/components/ui/button";
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
      await logout();
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Redirecionando...",
        variant: "default",
        duration: 1500,
      });
      
      // Add delay before redirect to show the toast
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Não foi possível realizar o logout. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <header className="bg-white shadow py-4">
      <div className="container-custom flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="/img/logotipo/logotipoBestCode.png" 
            alt="Code Academy" 
            className="h-8" 
          />
          <h1 className="text-2xl font-bold text-bestcode-800">Painel do Professor</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Olá, {userName}</span>
          <Button variant="outline" className="hover:bg-bestcode-700 hover:text-white" onClick={handleLogout}>Sair</Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
