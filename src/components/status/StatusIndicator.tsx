
import { cn } from "@/lib/utils";

type StatusType = 'active' | 'warning' | 'error' | 'inactive';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  className?: string;
  showIndicator?: boolean; // New prop to control indicator visibility
}

export function StatusIndicator({ 
  status, 
  label,
  className,
  showIndicator = true // Default to true to maintain backward compatibility
}: StatusIndicatorProps) {
  const statusClass = {
    'active': 'status-dot-active',
    'warning': 'status-dot-warning',
    'error': 'status-dot-error',
    'inactive': 'status-dot-inactive'
  }[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showIndicator && <span className={cn("status-dot", statusClass)}></span>}
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
}
