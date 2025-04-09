
import { cn } from "@/lib/utils";

type StatusType = 'active' | 'warning' | 'error' | 'inactive';
type RuntimeStatusType = 'connecting' | 'connected' | 'failed' | 'disconnected';

interface StatusIndicatorProps {
  status: StatusType | RuntimeStatusType;
  label?: string;
  className?: string;
}

export function StatusIndicator({ 
  status, 
  label,
  className 
}: StatusIndicatorProps) {
  const statusConfig = {
    // Server instance statuses
    'active': { class: 'bg-green-500', dotClass: 'status-active' },
    'warning': { class: 'bg-yellow-500', dotClass: 'status-warning' },
    'error': { class: 'bg-red-500', dotClass: 'status-error' },
    'inactive': { class: 'bg-slate-300', dotClass: 'status-inactive' },
    
    // Runtime statuses
    'connected': { class: 'bg-green-500', dotClass: 'status-active' },
    'connecting': { class: 'bg-blue-500', dotClass: 'status-connecting animate-pulse' },
    'failed': { class: 'bg-red-500', dotClass: 'status-error' },
    'disconnected': { class: 'bg-slate-300', dotClass: 'status-inactive' }
  }[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("h-2.5 w-2.5 rounded-full", statusConfig.class, statusConfig.dotClass)}></span>
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
}
