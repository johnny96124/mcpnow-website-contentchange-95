
import React from "react";
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

interface ServerErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverName: string;
  errorMessage: string;
}

export const ServerErrorDialog: React.FC<ServerErrorDialogProps> = ({
  open,
  onOpenChange,
  serverName,
  errorMessage,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
