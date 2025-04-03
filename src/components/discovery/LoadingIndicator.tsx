
import React from "react";
import { Loader } from "lucide-react";

export const LoadingIndicator = () => {
  return (
    <div className="flex items-center justify-center w-full py-6">
      <div className="flex flex-col items-center gap-2 animate-fade-in">
        <Loader className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading more servers...</p>
      </div>
    </div>
  );
};
