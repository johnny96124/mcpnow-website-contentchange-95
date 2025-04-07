
import { cn } from "@/lib/utils";

// Update the type definition to include all possible endpoint types
export type EndpointType = 'HTTP_SSE' | 'CLI_PROCESS' | 'STDIO';

interface EndpointLabelProps {
  type: EndpointType;
  className?: string;
}

export function EndpointLabel({ type, className }: EndpointLabelProps) {
  const getEndpointInfo = () => {
    switch (type) {
      case 'HTTP_SSE':
        return { label: 'HTTP', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' };
      case 'CLI_PROCESS':
        return { label: 'CLI', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' };
      case 'STDIO':
        return { label: 'STDIO', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' };
      default:
        return { label: type, className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' };
    }
  };
  
  const { label, className: typeClassName } = getEndpointInfo();
  
  return (
    <span className={cn("endpoint-tag", typeClassName, className)}>
      {label}
    </span>
  );
}
