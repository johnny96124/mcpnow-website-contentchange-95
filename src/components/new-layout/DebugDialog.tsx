
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ServerInstance } from "@/data/mockData";

interface DebugDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerInstance | null;
}

export function DebugDialog({ open, onOpenChange, server }: DebugDialogProps) {
  if (!server) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Debug {server.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
            <pre className="text-sm">
              {JSON.stringify(server, null, 2)}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
