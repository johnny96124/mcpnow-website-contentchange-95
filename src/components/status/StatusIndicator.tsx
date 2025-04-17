
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
  isSelected?: boolean;
  count?: number;
}

export function StatusIndicator({ 
  status, 
  label,
  className,
  iconOnly = false,
  size = 'md',
  useIcon = false,
  inline = false,
  onClick,
  isSelected = false,
  count
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

  const isClickable = typeof onClick === 'function';

  return (
    <div 
      className={cn(
        "flex items-center gap-1.5", 
        inline ? "inline-flex" : "", 
        isClickable ? "cursor-pointer hover:opacity-80 transition-opacity" : "",
        isSelected && "ring-2 ring-offset-1 ring-primary rounded-sm px-1 py-0.5",
        className
      )}
      onClick={onClick}
    >
      {status !== 'none' && (
        useIcon ? (
          <CircleDot className={cn("text-muted-foreground", sizeClass)} />
        ) : (
          <span className={cn("status-dot rounded-full", statusClass, sizeClass)}></span>
        )
      )}
      {!iconOnly && (
        <div className="flex items-center gap-1">
          {label && (
            <span className={cn("font-medium", size === 'sm' ? 'text-xs' : 'text-sm')}>
              {label}
            </span>
          )}
          {typeof count === 'number' && count > 0 && (
            <span className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
              status === 'active' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
              status === 'error' ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
              status === 'warning' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
              "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
            )}>
              {count}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
