
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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
          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold tracking-tight">View Configuration</h2>
            <p className="text-muted-foreground">View configuration file details</p>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold">Configuration File Path</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>MCP now uses the default path for each host</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="w-full rounded-md border bg-muted/50 px-3 py-2">
              <code className="text-sm font-mono">{configPath}</code>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold">Configuration Details</h3>
            <pre className="w-full rounded-md border bg-muted/50 p-4 overflow-auto">
              <code className="text-sm font-mono whitespace-pre">{configContent}</code>
            </pre>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="default"
            className="bg-blue-500 hover:bg-blue-600 text-white" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
