import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { ProfileEditModal } from "./ProfileEditModal";
import { SettingsModal } from "./SettingsModal";
import { toast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  userName: string;
}

const AdminDashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await logout();
      
      if (result.success) {
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso."
        });
        
        navigate("/login", { replace: true });
      } else {
        toast({
          title: "Erro no logout",
          description: "Não foi possível sair. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    }
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
                    <Link
                      to="/admin/students"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      Alunos
                    </Link>
                    <Link
                      to="/admin/teachers"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      Professores
                    </Link>
                    <Link
                      to="/admin/courses"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      Cursos
                    </Link>
                    <Link
                      to="/admin/payments"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      Pagamentos
                    </Link>
                    <Link
                      to="/admin/enrollments"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      Matrículas
                    </Link>
                    <Link
                      to="/admin/reports"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      Relatórios
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/admin/students" className="flex items-center space-x-2">
              <img 
                src="/img/logotipo/logotipoBestCode.png" 
                alt="Code Academy" 
                className="h-8" 
              />
              <span className="text-xs bg-bestcode-100 text-bestcode-600 py-0.5 px-2 rounded-md">
                Admin
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/admin/students"
              className="text-gray-700 hover:text-bestcode-600"
            >
              Alunos
            </Link>
            <Link
              to="/admin/teachers"
              className="text-gray-700 hover:text-bestcode-600"
            >
              Professores
            </Link>
            <Link
              to="/admin/courses"
              className="text-gray-700 hover:text-bestcode-600"
            >
              Cursos
            </Link>
            <Link
              to="/admin/payments"
              className="text-gray-700 hover:text-bestcode-600"
            >
              Pagamentos
            </Link>
            <Link
              to="/admin/enrollments"
              className="text-gray-700 hover:text-bestcode-600"
            >
              Matrículas
            </Link>
            <Link
              to="/admin/reports"
              className="text-gray-700 hover:text-bestcode-600"
            >
              Relatórios
            </Link>
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
                <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
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
