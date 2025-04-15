
import React from "react";
import { WifiOff, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NoNetworkStateProps {
  onRetry: () => void;
}

export const NoNetworkState = ({ onRetry }: NoNetworkStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-12 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 w-full animate-fade-in">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
          <WifiOff className="h-12 w-12 text-gray-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">No Network Connection</h3>
          <p className="text-muted-foreground">
            Unable to connect to the server. Please check your internet connection and try again.
          </p>
        </div>
        <div className="flex gap-3 mt-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="min-w-[100px]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button 
            onClick={onRetry}
            className="min-w-[140px] bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
        </div>
      </div>
    </div>
  );
};
