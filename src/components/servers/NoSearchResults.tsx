
import { FileSearch, AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface NoSearchResultsProps {
  query?: string;
  onClear?: () => void;
  entityName?: string;
  title?: string;
  message?: ReactNode;
  icon?: ReactNode;
  actionButton?: ReactNode;
}

export function NoSearchResults({ 
  query, 
  onClear, 
  entityName = "servers",
  title,
  message,
  icon,
  actionButton
}: NoSearchResultsProps) {
  // Default title based on query presence
  const defaultTitle = query ? `No ${entityName} found` : `No ${entityName} selected`;
  
  // Default message based on query presence
  const defaultMessage = query 
    ? `No ${entityName} match your search for "${query}"`
    : `Please select ${entityName} to continue`;

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center border-2 border-dashed rounded-lg">
      {icon || (query ? (
        <FileSearch className="h-12 w-12 text-muted-foreground mb-4" />
      ) : (
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
      ))}
      
      <h3 className="text-lg font-medium mb-1">{title || defaultTitle}</h3>
      
      <p className="text-muted-foreground mb-4">
        {message || defaultMessage}
      </p>
      
      {actionButton || (onClear && query && (
        <Button variant="outline" onClick={onClear}>
          Clear Search
        </Button>
      ))}
    </div>
  );
}
