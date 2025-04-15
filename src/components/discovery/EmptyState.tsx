
import React from "react";
import { SearchX } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  searchQuery: string;
  onReset: () => void;
}

export const EmptyState = ({ searchQuery, onReset }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 w-full">
      <div className="flex flex-col items-center gap-4 text-center max-w-md animate-fade-in">
        <div className="rounded-full bg-muted/50 p-4">
          <SearchX className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">No matching servers found</h3>
        <p className="text-muted-foreground">
          We couldn't find any MCP servers matching 
          "<span className="font-medium text-foreground">{searchQuery}</span>".
          Try adjusting your search or filter criteria.
        </p>
        <div className="flex flex-col gap-3 w-full items-center">
          <button 
            onClick={onReset}
            className="text-primary hover:text-primary/80 underline underline-offset-4 text-sm font-medium transition-colors"
          >
            Clear search
          </button>
          <Link 
            to="/discovery/no-network" 
            className="text-muted-foreground hover:text-muted-foreground/80 text-xs"
          >
            Test Network Error State
          </Link>
        </div>
      </div>
    </div>
  );
};
