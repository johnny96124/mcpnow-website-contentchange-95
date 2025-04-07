
import { cn } from "@/lib/utils";

interface EndpointLabelProps {
  type: 'HTTP_SSE' | 'CLI_PROCESS'; // Updated to match ServerDefinition type
  className?: string;
}

export function EndpointLabel({ type, className }: EndpointLabelProps) {
  const labelText = type === 'HTTP_SSE' ? 'HTTP SSE' : 'STDIO';
  const labelClass = type === 'HTTP_SSE' ? 'endpoint-http' : 'endpoint-stdio';
  
  return (
    <span className={cn("endpoint-tag", labelClass, className)}>
      {labelText}
    </span>
  );
}
