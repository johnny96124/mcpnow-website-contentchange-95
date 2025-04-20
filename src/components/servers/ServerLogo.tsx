
import React from 'react';
import { cn } from "@/lib/utils";

interface ServerLogoProps {
  name: string;
  className?: string;
  size?: 'default' | 'large';
}

export const ServerLogo: React.FC<ServerLogoProps> = ({ name, className, size = 'default' }) => {
  // Generate initials from name
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn(
      "flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/20 border border-blue-100 dark:border-blue-900",
      size === 'large' ? "w-12 h-12" : "w-10 h-10",
      className
    )}>
      <span className={cn(
        "font-semibold text-blue-700 dark:text-blue-300",
        size === 'large' ? "text-base" : "text-sm"
      )}>
        {initials}
      </span>
    </div>
  );
};
