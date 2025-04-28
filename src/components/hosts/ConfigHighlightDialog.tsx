
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
import { FileText } from "lucide-react";

interface ConfigHighlightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configPath: string;
}

export const ConfigHighlightDialog: React.FC<ConfigHighlightDialogProps> = ({
  open,
  onOpenChange,
  configPath,
}) => {
  // Sample config for demonstration
  const configContent = `{
  "mcpServers": {
    "mcpnow": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/mcpnow", "http://localhost:8008/mcp"]
    }
  }
}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Configuration File
          </DialogTitle>
          <DialogDescription>
            {configPath}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <pre className="rounded-md bg-muted p-4 overflow-auto text-sm font-mono whitespace-pre">
            {configContent}
          </pre>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>
            Edit Config
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
