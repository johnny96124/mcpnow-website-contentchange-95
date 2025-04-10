
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface CategoryBadgeProps {
  category: string;
  variant?: "default" | "outline";
}

export const CategoryBadge = ({ category, variant = "outline" }: CategoryBadgeProps) => {
  return (
    <Badge 
      variant={variant} 
      className="bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300 text-xs px-3 py-0.5 rounded-full flex items-center"
    >
      <Tag className="h-3 w-3 mr-1.5" />
      {category}
    </Badge>
  );
};
