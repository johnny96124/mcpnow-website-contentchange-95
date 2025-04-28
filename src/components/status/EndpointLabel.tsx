
import { cn } from "@/lib/utils";
import type { EndpointType } from "@/data/mockData";

interface EndpointLabelProps {
  type: EndpointType | 'Custom';
  className?: string;
}

export function EndpointLabel({ type, className }: EndpointLabelProps) {
  let labelText = '';
  let typeClasses = '';
  
  switch(type) {
    case 'HTTP_SSE':
      labelText = 'HTTP SSE';
      typeClasses = "bg-blue-50 text-blue-700 border border-blue-200";
      break;
    case 'STDIO':
      labelText = 'STDIO';
      typeClasses = "bg-purple-50 text-purple-700 border border-purple-200";
      break;
    case 'WS':
      labelText = 'WebSocket';
      typeClasses = "bg-green-50 text-green-700 border border-green-200";
      break;
    case 'Custom':
      labelText = 'Custom';
      typeClasses = "bg-gray-50 text-gray-700 border border-gray-200";
      break;
  }
  
  const baseClasses = "px-2 py-0.5 text-xs font-medium rounded-md";
  
  return (
    <span className={cn(baseClasses, typeClasses, className)}>
      {labelText}
    </span>
  );
}
