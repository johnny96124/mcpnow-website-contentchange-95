
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
  animate?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export function StatusIndicator({ 
  status, 
  label,
  className,
  iconOnly = false,
  size = 'md',
  useIcon = false,
  inline = false,
  animate = false,
  onClick,
  selected = false
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

  const isClickable = !!onClick;
  
  const selectedStyle = selected ? {
    'active': 'bg-status-active/10 ring-1 ring-status-active',
    'warning': 'bg-status-warning/10 ring-1 ring-status-warning',
    'error': 'bg-status-error/10 ring-1 ring-status-error',
    'inactive': 'bg-status-inactive/10 ring-1 ring-status-inactive',
    'none': '',
    'verified': 'bg-status-verified/10 ring-1 ring-status-verified',
  }[status] : '';

  const containerClasses = cn(
    "flex items-center gap-1.5", 
    inline ? "inline-flex" : "", 
    isClickable ? "cursor-pointer hover:opacity-80 transition-opacity" : "",
    selectedStyle,
    isClickable && selected ? "px-2 py-0.5 rounded-full" : "",
    className
  );

  return (
    <div 
      className={containerClasses}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
    >
      {status !== 'none' && (
        useIcon ? (
          <CircleDot className={cn(
            "text-muted-foreground", 
            sizeClass,
            status === 'active' && "text-status-active",
            status === 'warning' && "text-status-warning",
            status === 'error' && "text-status-error",
            status === 'verified' && "text-status-verified"
          )} />
        ) : (
          <span className={cn(
            "status-dot rounded-full", 
            statusClass, 
            sizeClass,
            animate && "animate-status-dot"
          )}></span>
        )
      )}
      {!iconOnly && label && (
        <span className={cn(
          "font-medium", 
          size === 'sm' ? 'text-xs' : 'text-sm',
          status === 'active' && "text-status-active",
          status === 'warning' && "text-status-warning",
          status === 'error' && "text-status-error",
          status === 'verified' && "text-status-verified"
        )}>
          {label}
        </span>
      )}
    </div>
  );
}
