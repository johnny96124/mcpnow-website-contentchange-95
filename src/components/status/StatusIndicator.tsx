
import { cn } from "@/lib/utils";

type StatusType = 'active' | 'warning' | 'error' | 'inactive';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export function StatusIndicator({ 
  status, 
  label,
  className 
}: StatusIndicatorProps) {
  const statusClass = {
    'active': 'bg-green-500',
    'warning': 'bg-yellow-500',
    'error': 'bg-red-500',
    'inactive': 'bg-gray-400'
  }[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("h-2.5 w-2.5 rounded-full", statusClass)}></span>
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
}
