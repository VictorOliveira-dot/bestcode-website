
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
      <div className="container-custom flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/b4ecc0b2-68c4-4080-9155-188e2851371f.png" 
            alt="Code Academy" 
            className="h-8" 
          />
          <h1 className="text-xl font-bold text-bestcode-800">Painel do Aluno</h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-gray-600">Olá, {userName}</span>
          <Button variant="outline" className="hover:bg-bestcode-400 hover:text-white" onClick={handleLogout}>Sair</Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
