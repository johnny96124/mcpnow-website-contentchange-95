
import React from 'react';
import { cn } from "@/lib/utils";

interface ServerLogoProps {
  name: string;
  className?: string;
}

export const ServerLogo: React.FC<ServerLogoProps> = ({ name, className }) => {
  // Generate initials from name
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 1);

  return (
    <div className={cn(
      "flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/30",
      className
    )}>
      <span className="text-lg font-medium text-blue-600 dark:text-blue-400">
        {initials}
      </span>
    </div>
  );
};
