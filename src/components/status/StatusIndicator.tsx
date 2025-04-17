
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
}

export function StatusIndicator({ 
  status, 
  label,
  className,
  iconOnly = false,
  size = 'md',
  useIcon = false,
  inline = false
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

  const textSizeClass = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={cn(
      "flex items-center gap-1.5", 
      inline ? "inline-flex" : "", 
      className
    )}>
      {status !== 'none' && (
        useIcon ? (
          <CircleDot className={cn("text-muted-foreground", sizeClass)} />
        ) : (
          <span className={cn(
            "status-dot rounded-full", 
            statusClass, 
            sizeClass,
            "ring-2 ring-opacity-30",
            status === 'active' && "ring-green-300",
            status === 'warning' && "ring-amber-300",
            status === 'error' && "ring-red-300",
            status === 'inactive' && "ring-gray-300",
            status === 'verified' && "ring-green-300",
          )}></span>
        )
      )}
      {!iconOnly && label && (
        <span className={cn("font-medium", textSizeClass)}>
          {label}
        </span>
      )}
    </div>
  );
}
