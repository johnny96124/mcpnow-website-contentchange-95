
import { cn } from "@/lib/utils";

type StatusType = 'active' | 'warning' | 'error' | 'inactive' | 'none';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  className?: string;
  iconOnly?: boolean; // Added option to show only the status icon without label
}

export function StatusIndicator({ 
  status, 
  label,
  className,
  iconOnly = false
}: StatusIndicatorProps) {
  const statusClass = {
    'active': 'status-active',
    'warning': 'status-warning',
    'error': 'status-error',
    'inactive': 'status-inactive',
    'none': 'status-none'
  }[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {status !== 'none' && <span className={cn("status-dot", statusClass)}></span>}
      {!iconOnly && label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
}
