
import { cn } from "@/lib/utils";
import type { EndpointType } from "@/data/mockData";

interface EndpointLabelProps {
  type: EndpointType;
  className?: string;
}

export function EndpointLabel({ type, className }: EndpointLabelProps) {
  const labelText = type === 'HTTP_SSE' ? 'HTTP SSE' : 'STDIO';
  
  return (
    <span className={cn(
      "rounded-full text-sm font-medium py-1 px-3",
      type === 'HTTP_SSE' 
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" 
        : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
      className
    )}>
      {labelText}
    </span>
  );
}
