
import React from "react";
import { CategoryBadge } from "./CategoryBadge";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
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
    <div className="flex flex-wrap gap-2">
      {visibleCategories.map((category) => (
        <CategoryBadge key={category} category={category} />
      ))}
      
      {hasExtra && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Badge 
                  variant="outline" 
                  className="bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300 text-xs px-3 py-0.5 rounded-full cursor-default flex items-center"
                >
                  +{extraCategories.length}
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-wrap max-w-[250px] gap-2 p-2">
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
