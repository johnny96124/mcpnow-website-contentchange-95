
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServerInstance } from "@/data/mockData";

interface ServerErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerInstance | null;
  errorDetails: string;
}

export function ServerErrorDialog({ 
  open, 
  onOpenChange, 
  server, 
  errorDetails 
}: ServerErrorDialogProps) {
  if (!server) return null;

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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
