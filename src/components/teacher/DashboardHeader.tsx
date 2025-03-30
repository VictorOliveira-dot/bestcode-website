
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
    <header className="bg-black text-white shadow py-4">
      <div className="container-custom flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Painel do Professor</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Olá, {userName}</span>
          <Button variant="outline" className="border-white text-white hover:bg-gray-800" onClick={handleLogout}>Sair</Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
