
import { useState, useEffect } from "react";
import { Check, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { discoveryItems } from "@/data/mockData";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const CategoryFilter = ({ 
  selectedCategory, 
  onCategoryChange 
}: CategoryFilterProps) => {
  const [allCategories, setAllCategories] = useState<string[]>([]);

  useEffect(() => {
    // Extract all unique categories from discovery items
    const categories = new Set<string>();
    discoveryItems.forEach(item => {
      item.categories?.forEach(category => {
        categories.add(category);
      });
    });
    setAllCategories(Array.from(categories).sort());
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          {selectedCategory || "All Categories"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={selectedCategory === null}
          onCheckedChange={() => onCategoryChange(null)}
        >
          All
        </DropdownMenuCheckboxItem>
        {allCategories.map(category => (
          <DropdownMenuCheckboxItem
            key={category}
            checked={selectedCategory === category}
            onCheckedChange={() => onCategoryChange(category)}
          >
            {category}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
