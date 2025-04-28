
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
import { FileText, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Configuration File
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1.5">
            {configPath}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Configuration file location on your system</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-2">
          <pre className="rounded-lg bg-muted/50 p-4 overflow-auto text-sm font-mono whitespace-pre border">
            {configContent}
          </pre>
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Edit Config
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
