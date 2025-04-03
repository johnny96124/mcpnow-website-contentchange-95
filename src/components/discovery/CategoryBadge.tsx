
import React from "react";
import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
  category: string;
  variant?: "default" | "outline";
}

export const CategoryBadge = ({ category, variant = "outline" }: CategoryBadgeProps) => {
  return (
    <Badge variant={variant} className="mr-1.5 mb-1.5">
      {category}
    </Badge>
  );
};
