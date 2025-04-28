
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ServerInstance } from "@/data/mockData";

interface HistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerInstance | null;
}

export function HistoryDialog({ open, onOpenChange, server }: HistoryDialogProps) {
  if (!server) return null;

  // Mock history data
  const historyEntries = [
    { timestamp: "2025-04-28T14:30:00Z", event: "Server started", status: "running" },
    { timestamp: "2025-04-28T12:15:00Z", event: "Connection error", status: "error" },
    { timestamp: "2025-04-28T10:00:00Z", event: "Server stopped", status: "stopped" },
    { timestamp: "2025-04-28T08:45:00Z", event: "Server started", status: "running" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>History for {server.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="border rounded-md divide-y">
            {historyEntries.map((entry, index) => (
              <div key={index} className="p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{entry.event}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  <div 
                    className={`w-2 h-2 rounded-full mr-2 ${
                      entry.status === "running" 
                        ? "bg-green-500" 
                        : entry.status === "error" 
                        ? "bg-red-500" 
                        : "bg-gray-500"
                    }`} 
                  />
                  <span className="text-sm capitalize">{entry.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
