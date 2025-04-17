
import { cn } from "@/lib/utils";
import { CircleDot } from "lucide-react";

type StatusType = 'active' | 'warning' | 'error' | 'inactive' | 'none' | 'verified';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  useIcon?: boolean;
  inline?: boolean;
  onClick?: () => void;
}

export function StatusIndicator({ 
  status, 
  label,
  className,
  iconOnly = false,
  size = 'md',
  useIcon = false,
  inline = false,
  onClick
}: StatusIndicatorProps) {
  const statusClass = {
    'active': 'status-active',
    'warning': 'status-warning',
    'error': 'status-error',
    'inactive': 'status-inactive',
    'none': 'status-none',
    'verified': 'status-verified'
  }[status];
  
  const sizeClass = {
    'sm': useIcon ? 'h-3 w-3' : 'h-1.5 w-1.5',
    'md': useIcon ? 'h-4 w-4' : 'h-2.5 w-2.5',
    'lg': useIcon ? 'h-5 w-5' : 'h-3 w-3'
  }[size];

  const containerClasses = cn(
    "flex items-center gap-1.5", 
    inline ? "inline-flex" : "", 
    onClick ? "cursor-pointer hover:bg-muted/50 px-2 py-1 rounded-md transition-colors" : "",
    className
  );

  return (
    <div 
      className={containerClasses} 
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {status !== 'none' && (
        useIcon ? (
          <CircleDot className={cn("text-muted-foreground", sizeClass)} />
        ) : (
          <span className={cn("status-dot rounded-full", statusClass, sizeClass)}></span>
        )
      )}
      {!iconOnly && label && (
        <span className={cn("font-medium", size === 'sm' ? 'text-xs' : 'text-sm')}>
          {label}
        </span>
      )}
    </div>
  );
}
