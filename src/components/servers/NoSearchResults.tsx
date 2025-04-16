
import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoSearchResultsProps {
  query: string;
  onClear: () => void;
  entityName?: string;
}

export function NoSearchResults({ 
  query, 
  onClear, 
  entityName = "servers" 
}: NoSearchResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg mb-6">
      <FileSearch className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-1">No {entityName} found</h3>
      <p className="text-muted-foreground mb-4">
        No {entityName} match your search for "{query}"
      </p>
      <Button variant="outline" onClick={onClear}>
        Clear Search
      </Button>
    </div>
  );
}
