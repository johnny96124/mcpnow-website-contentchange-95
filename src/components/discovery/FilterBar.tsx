
import React from "react";
import { Search, Tag, X, Eye, Download, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedCategory: string | null;
  onClearFilters: () => void;
  categories: string[];
  onCategorySelect: (category: string | null) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  activeTab,
  onTabChange,
  selectedCategory,
  onClearFilters,
  categories,
  onCategorySelect,
}) => {
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-[280px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search servers, APIs, collections..."
              className="pl-10 bg-background border-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={sortOption} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-blue-600" />
                  Most Popular
                </div>
              </SelectItem>
              <SelectItem value="installed">
                <div className="flex items-center">
                  <Download className="h-4 w-4 mr-2 text-green-600" />
                  Most Installed
                </div>
              </SelectItem>
              <SelectItem value="stars">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-amber-500" />
                  Most Stars
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {!isSearching && (
        <>
          <Tabs 
            defaultValue="all" 
            className="w-full" 
            value={activeTab}
            onValueChange={onTabChange}
          >
            <div className="flex justify-between items-center border-b pb-1">
              <TabsList className="bg-transparent p-0 h-9">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-3"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="official"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-3"
                >
                  Official
                </TabsTrigger>
                <TabsTrigger 
                  value="community"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-3"
                >
                  Community
                </TabsTrigger>
              </TabsList>
              
              {selectedCategory && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={onClearFilters}
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>
          </Tabs>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={`
                  rounded-full text-xs px-3 h-7
                  ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-transparent'}
                `}
                onClick={() => onCategorySelect(selectedCategory === category ? null : category)}
              >
                <Tag className="h-3 w-3 mr-1" />
                {category}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
