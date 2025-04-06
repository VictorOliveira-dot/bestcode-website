
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso."
    });
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
