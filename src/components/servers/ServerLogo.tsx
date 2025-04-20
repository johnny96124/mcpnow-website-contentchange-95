
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
    .slice(0, 2);

  return (
    <div className={cn(
      "flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/20 border border-blue-100 dark:border-blue-900",
      className
    )}>
      <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
        {initials}
      </span>
    </div>
  );
};
