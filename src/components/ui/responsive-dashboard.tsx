import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ResponsiveDashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveDashboardLayout({ children, className }: ResponsiveDashboardLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen w-full",
      "bg-slate-50 dark:bg-slate-900",
      className
    )}>
      {children}
    </div>
  );
}

interface ResponsiveDashboardMainProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveDashboardMain({ children, className }: ResponsiveDashboardMainProps) {
  return (
    <main className={cn(
      "container-custom",
      "py-4 sm:py-6 lg:py-8",
      "px-4 sm:px-6 lg:px-8",
      "space-y-6 sm:space-y-8",
      className
    )}>
      {children}
    </main>
  );
}

interface ResponsiveDashboardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveDashboardHeader({ children, className }: ResponsiveDashboardHeaderProps) {
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

interface ResponsiveStatsGridProps {
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

export function ResponsiveStatsGrid({ 
  children, 
  className, 
  cols = { default: 1, sm: 2, lg: 3, xl: 4 } 
}: ResponsiveStatsGridProps) {
  const gridClasses = [
    "grid",
    `grid-cols-${cols.default || 1}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    "gap-4 sm:gap-6 lg:gap-8"
  ].filter(Boolean).join(" ");

  return (
    <div className={cn(gridClasses, className)}>
      {children}
    </div>
  );
}

interface ResponsiveActionsBarProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveActionsBar({ children, className }: ResponsiveActionsBarProps) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row gap-4",
      "justify-between items-start sm:items-center",
      "p-4 sm:p-6",
      "bg-card border rounded-lg",
      className
    )}>
      {children}
    </div>
  );
}

interface ResponsiveTabsWrapperProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveTabsWrapper({ children, className }: ResponsiveTabsWrapperProps) {
  return (
    <div className={cn(
      "w-full space-y-6",
      className
    )}>
      {children}
    </div>
  );
}

interface ResponsiveCardGridProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveCardGrid({ children, className }: ResponsiveCardGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
      className
    )}>
      {children}
    </div>
  );
}