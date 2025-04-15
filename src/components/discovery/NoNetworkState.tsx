
import React from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface NoNetworkStateProps {
  onRetry: () => void;
}

export const NoNetworkState: React.FC<NoNetworkStateProps> = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 animate-fade-in">
      <div className="w-full max-w-2xl">
        <Alert className="mb-6 bg-gray-50 dark:bg-gray-800/50 border-blue-100 dark:border-blue-900/50">
          <WifiOff className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-700 dark:text-blue-300 mb-2">Network connection issue</AlertTitle>
          <AlertDescription className="text-gray-600 dark:text-gray-300">
            We're having trouble connecting to the server. This could be due to network connectivity issues.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col items-center justify-center p-12 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 w-full">
          <div className="flex flex-col items-center gap-6 text-center max-w-md">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6">
              <WifiOff className="h-14 w-14 text-muted-foreground" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">No network connection</h3>
              <p className="text-muted-foreground">
                Unable to load server definitions. Please check your internet connection and try again.
              </p>
            </div>
            
            <Button 
              onClick={onRetry}
              className="mt-4"
              size="lg"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry connection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
