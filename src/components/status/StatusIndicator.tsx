
import { cn } from "@/lib/utils";

type StatusType = 'active' | 'warning' | 'error' | 'inactive';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusIndicator({ 
  status, 
  label,
  className,
  size = 'md'
}: StatusIndicatorProps) {
  const statusClass = {
    'active': 'status-active',
    'warning': 'status-warning',
    'error': 'status-error',
    'inactive': 'status-inactive'
  }[status];

  const sizeClass = {
    'sm': 'w-1.5 h-1.5',
    'md': 'w-2 h-2',
    'lg': 'w-2.5 h-2.5'
  }[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("rounded-full flex-shrink-0", sizeClass, {
        'bg-green-500': status === 'active',
        'bg-yellow-500': status === 'warning',
        'bg-red-500': status === 'error',
        'bg-gray-400': status === 'inactive',
      })}></span>
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
}
