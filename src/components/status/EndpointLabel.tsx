
import { cn } from "@/lib/utils";
import type { EndpointType } from "@/data/mockData";

interface EndpointLabelProps {
  type: EndpointType;
  className?: string;
}

export function EndpointLabel({ type, className }: EndpointLabelProps) {
  const labelText = type === 'HTTP_SSE' ? 'HTTP SSE' : 'STDIO';
  const baseClasses = "px-2 py-0.5 text-xs font-medium rounded";
  const typeClasses = type === 'HTTP_SSE' 
    ? "bg-blue-50 text-blue-700 border border-blue-200" 
    : "bg-purple-50 text-purple-700 border border-purple-200";
  
  return (
    <span className={cn(baseClasses, typeClasses, className)}>
      {labelText}
    </span>
  );
}
