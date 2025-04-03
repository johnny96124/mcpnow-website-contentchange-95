
import React, { useState } from "react";
import { CategoryBadge } from "./CategoryBadge";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategoryListProps {
  categories: string[];
  maxVisible?: number;
}

export const CategoryList = ({ 
  categories, 
  maxVisible = 3 
}: CategoryListProps) => {
  const visibleCategories = categories.slice(0, maxVisible);
  const extraCategories = categories.slice(maxVisible);
  const hasExtra = extraCategories.length > 0;

  return (
    <div className="flex flex-wrap">
      {visibleCategories.map((category) => (
        <CategoryBadge key={category} category={category} />
      ))}
      
      {hasExtra && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Badge variant="outline" className="mr-1.5 mb-1.5 cursor-default">
                  +{extraCategories.length}
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-wrap max-w-[200px]">
                {extraCategories.map((category) => (
                  <CategoryBadge key={category} category={category} />
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
