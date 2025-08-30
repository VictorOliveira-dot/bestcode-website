import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveLayout({ children, className }: ResponsiveLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen w-full",
      "px-4 py-4 sm:px-6 lg:px-8", // Responsive padding
      "max-w-7xl mx-auto", // Max width with auto margins
      className
    )}>
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function ResponsiveGrid({ 
  children, 
  className, 
  cols = { default: 1, sm: 2, md: 3, lg: 4 } 
}: ResponsiveGridProps) {
  const gridClasses = [
    `grid`,
    `grid-cols-${cols.default || 1}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    "gap-4 sm:gap-6"
  ].filter(Boolean).join(" ");

  return (
    <div className={cn(gridClasses, className)}>
      {children}
    </div>
  );
}

interface ResponsiveCardProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveCard({ children, className }: ResponsiveCardProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      "p-4 sm:p-6", // Responsive padding
      "w-full", // Full width
      className
    )}>
      {children}
    </div>
  );
}

interface ResponsiveTableProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn(
      "rounded-md border",
      "overflow-x-auto", // Horizontal scroll on small screens
      "w-full",
      className
    )}>
      <div className="min-w-full">
        {children}
      </div>
    </div>
  );
}