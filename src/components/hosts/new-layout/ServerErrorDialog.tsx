
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServerInstance } from "@/data/mockData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ServerErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerInstance | null;
  errorDetails: string;
  onRetryConnection?: (serverId: string) => Promise<boolean>;
}

export function ServerErrorDialog({ 
  open, 
  onOpenChange, 
  server, 
  errorDetails,
  onRetryConnection
}: ServerErrorDialogProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  if (!server) return null;

  const handleRetryConnection = async () => {
    if (!onRetryConnection) {
      // If no retry function provided, simulate a connection
      handleSimulatedRetry();
      return;
    }
    
    setIsRetrying(true);
    
    try {
      const success = await onRetryConnection(server.id);
      
      if (success) {
        toast({
          title: "Connection successful",
          description: `Successfully connected to ${server.name}`,
          type: "success",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Connection failed",
          description: `Failed to connect to ${server.name}. Please try again.`,
          type: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: `An error occurred while connecting to ${server.name}`,
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
          description: `Successfully connected to ${server.name}`,
          type: "success",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Connection failed",
          description: `Failed to connect to ${server.name}. Please try again.`,
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Server Connection Error
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Failed to connect to {server.name}</AlertTitle>
            <AlertDescription>
              {errorDetails || "Connection error occurred"}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h4 className="font-medium">Troubleshooting Steps:</h4>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li>Check that the server is running and accessible</li>
              <li>Verify connection details are correct</li>
              <li>Ensure the host has network access to the server</li>
              <li>Check server logs for any errors</li>
              <li>Restart the server and try again</li>
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
            onClick={handleRetryConnection}
            disabled={isRetrying}
            className="gap-2"
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
}
