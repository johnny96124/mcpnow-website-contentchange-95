
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ServerErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverName: string;
  errorMessage: string;
  onRetryConnection?: () => Promise<boolean>;
}

export const ServerErrorDialog: React.FC<ServerErrorDialogProps> = ({
  open,
  onOpenChange,
  serverName,
  errorMessage,
  onRetryConnection,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  const handleRetryConnection = async () => {
    if (!onRetryConnection) {
      // If no retry function provided, simulate a connection
      handleSimulatedRetry();
      return;
    }
    
    setIsRetrying(true);
    
    try {
      const success = await onRetryConnection();
      
      if (success) {
        toast({
          title: "Connection successful",
          description: `Successfully connected to ${serverName}`,
          type: "success",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Connection failed",
          description: `Failed to connect to ${serverName}. Please try again.`,
          type: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: `An error occurred while connecting to ${serverName}`,
        type: "error",
      });
    } finally {
      setIsRetrying(false);
    }
  };

  // Simulate a connection attempt if no retry function is provided
  const handleSimulatedRetry = () => {
    setIsRetrying(true);
    
    // Simulate network request with a delay
    setTimeout(() => {
      // 70% chance of success for demonstration
      const success = Math.random() > 0.3;
      
      if (success) {
        toast({
          title: "Connection successful",
          description: `Successfully connected to ${serverName}`,
          type: "success",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Connection failed",
          description: `Failed to connect to ${serverName}. Please try again.`,
          type: "error",
        });
      }
      
      setIsRetrying(false);
    }, 2000); // 2 second delay to simulate network request
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Prevent closing dialog during retry attempt
      if (isRetrying && !newOpen) {
        return;
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Connection Error
          </DialogTitle>
          <DialogDescription>
            There was a problem connecting to {serverName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Possible solutions:</h4>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>Check if the server is running and accessible</li>
              <li>Verify the endpoint URL/configuration is correct</li>
              <li>Ensure the host has necessary permissions to access the server</li>
              <li>Check network connectivity between the host and server</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isRetrying}
          >
            Close
          </Button>
          <Button 
            className="gap-2"
            onClick={handleRetryConnection}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Retry Connection
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
