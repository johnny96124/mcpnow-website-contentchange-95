
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServerEventsList } from "@/components/discovery/ServerEventsList";
import { ServerInstance } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History } from "lucide-react";

interface ServerHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerInstance | null;
}

export function ServerHistoryDialog({
  open,
  onOpenChange,
  server
}: ServerHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0 bg-gradient-to-b from-background to-muted/20">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <History className="w-5 h-5 text-primary" />
            Server History - {server?.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            View message history and event logs for this server instance
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="message-history" className="px-6 pb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="message-history">Message History</TabsTrigger>
            <TabsTrigger value="event-logs">Event Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="message-history">
            <ServerEventsList 
              events={[]} 
              instanceName={server?.name}
            />
          </TabsContent>
          <TabsContent value="event-logs">
            <div className="text-center text-muted-foreground py-8">
              Event logs will appear here
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
