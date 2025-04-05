
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

const colorMap: Record<string, string> = {
  // Pre-defined colors for specific names
  "General Development": "bg-blue-500",
  "Database Operations": "bg-purple-500", 
  "Project X": "bg-green-500",
  "Local File Assistant": "bg-red-500",
  // Add more as needed
};

// Function to generate consistent colors based on name
const getColorFromName = (name: string): string => {
  // Calculate a simple hash from the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert to a hue value (0-360)
  const hue = Math.abs(hash % 360);
  
  // HSL colors with fixed saturation and lightness
  return `hsl(${hue}, 70%, 50%)`;
};

interface ProfileBadgeProps {
  name: string;
  className?: string;
}

export function ProfileBadge({ name, className }: ProfileBadgeProps) {
  const backgroundColor = useMemo(() => {
    // Use predefined color if available, otherwise generate one
    return colorMap[name] || getColorFromName(name);
  }, [name]);
  
  return (
    <div 
      className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
        className
      )}
      style={{ backgroundColor }}
      title={name}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
