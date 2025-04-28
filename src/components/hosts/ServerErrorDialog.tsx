
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Settings, Link, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ServerErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverName: string;
  errorDetails: string;
  onRetry: () => void;
  onViewConfig: () => void;
}

export function ServerErrorDialog({
  open,
  onOpenChange,
  serverName,
  errorDetails,
  onRetry,
  onViewConfig
}: ServerErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Connection Error</DialogTitle>
          </div>
          <DialogDescription>
            Failed to connect to server "{serverName}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border rounded-md bg-red-50/30 p-4">
            <h4 className="font-medium mb-2 text-red-800">Error Details</h4>
            <ScrollArea className="h-[100px]">
              <div className="text-sm text-red-700 font-mono whitespace-pre-wrap">
                {errorDetails || "Failed to establish connection to the server. The endpoint might be unreachable."}
              </div>
            </ScrollArea>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Suggested Actions</h4>
            <ul className="text-sm space-y-2">
              <li className="flex gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span>Retry the connection</span>
              </li>
              <li className="flex gap-2">
                <Settings className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span>Check server configuration</span>
              </li>
              <li className="flex gap-2">
                <Link className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span>Verify network connectivity and endpoint URL</span>
              </li>
              <li className="flex gap-2">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span>Check host config file</span>
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="outline" onClick={onViewConfig}>
            View Config
          </Button>
          <Button onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
