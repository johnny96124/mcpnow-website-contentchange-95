
import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoSearchResultsProps {
  query?: string;
  onClear?: () => void;
  entityName?: string;
  message?: string;
  icon?: React.ReactNode;
  showButton?: boolean;
  buttonText?: string;
  customClassName?: string;
}

export function NoSearchResults({ 
  query, 
  onClear, 
  entityName = "servers",
  message,
  icon,
  showButton = true,
  buttonText = "Clear Search",
  customClassName
}: NoSearchResultsProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg mb-6 ${customClassName || ""}`}>
      {icon || <FileSearch className="h-12 w-12 text-muted-foreground mb-4" />}
      {query ? (
        <>
          <h3 className="text-lg font-medium mb-1">No {entityName} found</h3>
          <p className="text-muted-foreground mb-4">
            No {entityName} match your search for "{query}"
          </p>
        </>
      ) : (
        <p className="text-muted-foreground mb-4">
          {message || `No ${entityName} available`}
        </p>
      )}
      
      {showButton && onClear && (
        <Button variant="outline" onClick={onClear}>
          {buttonText}
        </Button>
      )}
    </div>
  );
}
