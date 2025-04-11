
import { cn } from "@/lib/utils";

type StatusType = 'active' | 'warning' | 'error' | 'inactive' | 'none' | 'verified';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusIndicator({ 
  status, 
  label,
  className,
  iconOnly = false,
  size = 'md'
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
    'sm': 'h-1.5 w-1.5',
    'md': 'h-2.5 w-2.5',
    'lg': 'h-3 w-3'
  }[size];

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {status !== 'none' && (
        <span className={cn("status-dot rounded-full", statusClass, sizeClass)}></span>
      )}
      {!iconOnly && label && (
        <span className={cn("font-medium", size === 'sm' ? 'text-xs' : 'text-sm')}>
          {label}
        </span>
      )}
    </div>
  );
}
