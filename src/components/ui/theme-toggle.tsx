
import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/hooks/useDarkMode";

export function ThemeToggle() {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
