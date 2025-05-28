
import React from "react";
import { Switch } from "@/components/ui/switch";
import { useDarkMode } from "@/hooks/useDarkMode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          {/* <div className="flex items-center justify-between">
            <label htmlFor="dark-mode" className="text-sm font-medium">
              Tema Escuro
            </label>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            Mais configurações serão adicionadas em breve...
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
