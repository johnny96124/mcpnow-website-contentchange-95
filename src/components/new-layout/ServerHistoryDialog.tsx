
import { ServerInstance } from "@/data/mockData";
import { ServerEvent } from "@/types/events";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ServerEventsList } from "@/components/discovery/ServerEventsList";

interface ServerHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerInstance | null;
}

const SAMPLE_EVENTS: ServerEvent[] = [
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
  },
  {
    id: "3",
    timestamp: "2024-04-18T12:59:47Z", 
    type: "response",
    category: "Tools",
    method: "tools/call",
    content: {
      result: "Transcript generated successfully"
    },
    params: {
      name: "get_transcript",
      arguments: { abc: true }  
    },
    jsonrpc: "2.0"
  }
];

export function ServerHistoryDialog({
  open,
  onOpenChange,
  server
}: ServerHistoryDialogProps) {
  if (!server) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            Message History - {server.name}
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">
          <ServerEventsList events={SAMPLE_EVENTS} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
