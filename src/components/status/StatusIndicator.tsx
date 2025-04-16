
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
  reversed?: boolean;
}

export function StatusIndicator({ 
  status, 
  label,
  className,
  iconOnly = false,
  size = 'md',
  useIcon = false,
  reversed = false
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

  const statusColorClass = {
    'active': 'text-green-500',
    'warning': 'text-yellow-500',
    'error': 'text-red-500',
    'inactive': 'text-gray-400',
    'none': '',
    'verified': 'text-blue-500'
  }[status];

  const labelSize = size === 'sm' ? 'text-xs' : 'text-sm';

  const dotElement = status !== 'none' && (
    useIcon ? (
      <CircleDot className={cn("text-muted-foreground", sizeClass, statusColorClass)} />
    ) : (
      <span className={cn("status-dot rounded-full", statusClass, sizeClass)}></span>
    )
  );

  const labelElement = !iconOnly && label && (
    <span className={cn("font-medium", labelSize)}>
      {label}
    </span>
  );

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {!reversed ? (
        <>
          {dotElement}
          {labelElement}
        </>
      ) : (
        <>
          {labelElement}
          {dotElement}
        </>
      )}
    </div>
  );
}
