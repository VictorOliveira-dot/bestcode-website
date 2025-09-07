import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveTableWrapperProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveTableWrapper({ children, className }: ResponsiveTableWrapperProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      "overflow-hidden",
      className
    )}>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

interface MobileTableCardProps {
  children: ReactNode;
  className?: string;
}

export function MobileTableCard({ children, className }: MobileTableCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4 space-y-3">
        {children}
      </CardContent>
    </Card>
  );
}

interface ResponsiveTableActionsProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveTableActions({ children, className }: ResponsiveTableActionsProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "flex",
      isMobile ? "flex-col gap-2" : "flex-row gap-2",
      "items-start",
      className
    )}>
      {children}
    </div>
  );
}

interface ResponsiveTableContainerProps {
  desktopTable: ReactNode;
  mobileCards: ReactNode;
  className?: string;
}

export function ResponsiveTableContainer({ 
  desktopTable, 
  mobileCards, 
  className 
}: ResponsiveTableContainerProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn("w-full", className)}>
      {isMobile ? (
        <div className="space-y-4">
          {mobileCards}
        </div>
      ) : (
        <ResponsiveTableWrapper>
          {desktopTable}
        </ResponsiveTableWrapper>
      )}
    </div>
  );
}