
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface EndpointLabelProps {
  type: 'HTTP_SSE' | 'STDIO';
  size?: 'xs' | 'sm' | 'default';
  className?: string;
}

export function EndpointLabel({ type, size = 'default', className }: EndpointLabelProps) {
  const textSizeClass = {
    'xs': 'text-[10px]',
    'sm': 'text-xs',
    'default': 'text-xs'
  }[size];
  
  const paddingClass = {
    'xs': 'px-1 py-0',
    'sm': 'px-1.5 py-0.5',
    'default': 'px-2 py-0.5'
  }[size];

  return (
    <Badge 
      variant="outline"
      className={cn(
        "rounded font-medium border", 
        textSizeClass,
        paddingClass,
        {
          "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300": 
            type === 'HTTP_SSE',
          "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300": 
            type === 'STDIO'
        },
        className
      )}
    >
      {type}
    </Badge>
  );
}
