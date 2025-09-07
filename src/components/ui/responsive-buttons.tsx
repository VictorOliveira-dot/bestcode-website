import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveButtonGroupProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveButtonGroup({ children, className }: ResponsiveButtonGroupProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "flex",
      isMobile ? "flex-col gap-2" : "flex-row gap-3 sm:gap-4",
      "items-stretch sm:items-center",
      className
    )}>
      {children}
    </div>
  );
}

interface ResponsiveActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
}

export function ResponsiveActionButton({ 
  children, 
  onClick, 
  variant = "default", 
  size = "default",
  className,
  disabled = false
}: ResponsiveActionButtonProps) {
  const isMobile = useIsMobile();
  
  return (
    <Button
      onClick={onClick}
      variant={variant}
      size={isMobile ? "sm" : size}
      className={cn(
        isMobile && "w-full justify-center",
        className
      )}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

interface ResponsiveFloatingButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ResponsiveFloatingButton({ children, onClick, className }: ResponsiveFloatingButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "h-14 w-14 rounded-full shadow-lg",
        "bg-primary hover:bg-primary/90",
        "text-primary-foreground",
        "sm:h-12 sm:w-12",
        className
      )}
    >
      {children}
    </Button>
  );
}