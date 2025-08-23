
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, Menu, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { ProfileEditModal } from "./ProfileEditModal";
import { SettingsModal } from "./SettingsModal";
import { toast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  userName: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminDashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  userName, 
  activeTab, 
  setActiveTab 
}) => {
  const { logout } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      console.log('Iniciando logout do admin dashboard...');
      
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
      console.error("Logout error:", error);
      
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

  const menuItems = [
    { id: 'students', label: 'Alunos' },
    { id: 'teachers', label: 'Professores' },
    { id: 'courses', label: 'Turmas' },
    { id: 'enrollments', label: 'Matrículas' },
    { id: 'reports', label: 'Relatórios' }
  ];

  const handleMenuClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsSheetOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <div className="container-custom h-16 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="py-4">
                  <div className="px-4 mb-4">
                    <img 
                      src="/img/logotipo/logotipoBestCode.png" 
                      alt="Code Academy" 
                      className="h-8 mb-2"
                    />
                    <span className="text-xs bg-bestcode-100 text-bestcode-600 py-0.5 px-2 rounded-md">
                      Admin
                    </span>
                  </div>
                  <nav className="space-y-1">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md w-full text-left ${
                          activeTab === item.id ? 'bg-bestcode-100 text-bestcode-600' : ''
                        }`}
                        onClick={() => handleMenuClick(item.id)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex items-center space-x-2">
              <img 
                src="/img/logotipo/logotipoBestCode.png" 
                alt="Code Academy" 
                className="h-8" 
              />
              <span className="text-xs bg-bestcode-100 text-bestcode-600 py-0.5 px-2 rounded-md">
                Admin
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`text-gray-700 hover:text-bestcode-600 ${
                  activeTab === item.id ? 'text-bestcode-600 font-medium' : ''
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
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
                <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="hidden md:inline text-sm font-medium">
              {userName}
            </span>
          </div>
        </div>
      </header>

      <ProfileEditModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </>
  );
};

export default AdminDashboardHeader;
