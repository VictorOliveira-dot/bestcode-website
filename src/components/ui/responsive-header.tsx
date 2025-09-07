import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface ResponsiveHeaderProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveHeader({ children, className }: ResponsiveHeaderProps) {
  return (
    <header className={cn(
      "bg-white dark:bg-gray-800",
      "border-b border-border",
      "sticky top-0 z-40",
      "shadow-sm",
      className
    )}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </header>
  );
}

interface ResponsiveHeaderBrandProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveHeaderBrand({ children, className }: ResponsiveHeaderBrandProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 min-w-0 flex-1",
      className
    )}>
      {children}
    </div>
  );
}

interface ResponsiveHeaderActionsProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveHeaderActions({ children, className }: ResponsiveHeaderActionsProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 sm:gap-4",
      className
    )}>
      {children}
    </div>
  );
}

interface ResponsiveHeaderNavigationProps {
  items: Array<{
    id: string;
    label: string;
    onClick: () => void;
    active?: boolean;
  }>;
  className?: string;
}

export function ResponsiveHeaderNavigation({ items, className }: ResponsiveHeaderNavigationProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="py-4">
            <nav className="space-y-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  className={cn(
                    "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md w-full text-left",
                    item.active && "bg-primary/10 text-primary font-medium"
                  )}
                  onClick={() => {
                    item.onClick();
                    setIsSheetOpen(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <nav className={cn("hidden md:flex items-center space-x-6", className)}>
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "text-gray-700 hover:text-primary transition-colors",
              item.active && "text-primary font-medium"
            )}
            onClick={item.onClick}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}