
import React from "react";
import { ServerInstance } from "@/data/mockData";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServerToolsList } from "@/components/discovery/ServerToolsList";
import { ServerEventsList } from "@/components/discovery/ServerEventsList";
import { Wrench, MessageSquare } from "lucide-react";

interface ServerDebugDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerInstance;
}

const SAMPLE_EVENTS = [
  {
    id: "1",
    timestamp: "2025-04-26T16:02:19Z",
    type: "notification",
    category: "Tools",
    method: "notification/system",
    content: {
      message: "System is running normally",
      status: "success"
    },
    isError: false,
    jsonrpc: "2.0"
  },
  {
    id: "2",
    timestamp: "2024-04-18T12:59:47Z",
    type: "error",
    category: "Tools",
    method: "tools/call",
    content: {
      error: "Failed to execute get_transcript",
      details: "Invalid parameters"
    },
    isError: true,
    params: {
      name: "get_transcript",
      arguments: { abc: true }
    },
    jsonrpc: "2.0"
  }
];

export function ServerDebugDialog({
  open,
  onOpenChange,
  server
}: ServerDebugDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Wrench className="h-5 w-5 text-purple-500" />
            Debug Tools - {server.name}
          </DialogTitle>
          <DialogDescription>
            Debug, execute tools, and view message history
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="tools" className="flex-1">
          <div className="border-b px-6">
            <TabsList className="mb-[-1px]">
              <TabsTrigger value="tools" className="gap-2">
                <Wrench className="h-4 w-4" />
                Tools
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Message History
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 pt-4">
            <TabsContent value="tools" className="m-0">
              <ServerToolsList 
                tools={server.tools || []}
                debugMode={true}
                serverName={server.name}
                instanceId={server.id}
              />
            </TabsContent>

            <TabsContent value="history" className="m-0">
              <ServerEventsList events={SAMPLE_EVENTS} />
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="p-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

