
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
    <header className="bg-white dark:bg-gray-800 shadow py-4">
      <div className="container-custom flex justify-between items-center">
        <h1 className="text-2xl font-bold text-bestcode-800 dark:text-bestcode-200">Painel do Professor</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 dark:text-gray-300">Olá, {userName}</span>
          <ThemeToggle />
          <Button variant="outline" onClick={handleLogout}>Sair</Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
