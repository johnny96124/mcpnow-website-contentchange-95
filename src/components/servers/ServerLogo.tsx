
import React from 'react';
import { cn } from "@/lib/utils";

interface ServerLogoProps {
  name: string;
  className?: string;
}

export const ServerLogo: React.FC<ServerLogoProps> = ({ name, className }) => {
  // Extract first letter or first letter of each word for the logo
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Generate a consistent color based on the name
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 6;
  const colors = [
    'from-blue-500/10 to-blue-600/20 border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300',
    'from-purple-500/10 to-purple-600/20 border-purple-100 dark:border-purple-900 text-purple-700 dark:text-purple-300',
    'from-green-500/10 to-green-600/20 border-green-100 dark:border-green-900 text-green-700 dark:text-green-300',
    'from-red-500/10 to-red-600/20 border-red-100 dark:border-red-900 text-red-700 dark:text-red-300',
    'from-yellow-500/10 to-yellow-600/20 border-yellow-100 dark:border-yellow-900 text-yellow-700 dark:text-yellow-300',
    'from-pink-500/10 to-pink-600/20 border-pink-100 dark:border-pink-900 text-pink-700 dark:text-pink-300',
  ];

  return (
    <div className={cn(
      "flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br border",
      colors[colorIndex],
      className
    )}>
      <span className="text-lg font-semibold">
        {initials}
      </span>
    </div>
  );
};
