
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServerInstance } from "@/data/mockData";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface ServerErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerInstance | null;
  errorDetails: string;
  onRetry?: (serverId: string) => Promise<boolean>;
  onStatusChange?: (serverId: string, status: 'connecting' | 'error' | 'running') => void;
}

export function ServerErrorDialog({ 
  open, 
  onOpenChange, 
  server, 
  errorDetails,
  onRetry,
  onStatusChange
}: ServerErrorDialogProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  
  if (!server) return null;
  
  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    
    // Update status to connecting
    if (onStatusChange) {
      onStatusChange(server.id, 'connecting');
    }
    
    try {
      const success = await onRetry(server.id);
      
      if (success) {
        toast({
          title: "Connection restored",
          description: `Successfully connected to ${server.name}`,
          variant: "default",
        });
        
        // Update status to running
        if (onStatusChange) {
          onStatusChange(server.id, 'running');
        }
        
        onOpenChange(false);
      } else {
        toast({
          title: "Connection failed",
          description: `Failed to connect to ${server.name}`,
          variant: "destructive",
        });
        
        // Update status back to error
        if (onStatusChange) {
          onStatusChange(server.id, 'error');
        }
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: `Error connecting to ${server.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      
      // Update status back to error
      if (onStatusChange) {
        onStatusChange(server.id, 'error');
      }
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isRetrying}>
            Close
          </Button>
          <Button 
            onClick={handleRetry} 
            disabled={isRetrying || !onRetry}
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
