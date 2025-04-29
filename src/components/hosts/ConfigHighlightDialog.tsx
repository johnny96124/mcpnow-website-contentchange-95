import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
interface ConfigHighlightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configPath: string;
}
export const ConfigHighlightDialog: React.FC<ConfigHighlightDialogProps> = ({
  open,
  onOpenChange,
  configPath
}) => {
  // Sample config for demonstration
  const configContent = `{
  "mcpServers": {
    "mcpnow": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/mcpnow",
        "http://localhost:8008/mcp"
      ]
    }
  }
}`;
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl">View Configuration</DialogTitle>
          <p className="text-muted-foreground mt-1 text-sm">
            View configuration file details
          </p>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-body font-semibold">Configuration File Path</Label>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    The path where your configuration file is stored
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="w-full p-3 bg-background rounded-lg border">
              <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                {configPath}
              </pre>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-lg font-semibold">Configuration Details</Label>
            <div className="w-full p-3 bg-background rounded-lg border">
              <pre className="text-sm font-mono whitespace-pre-wrap" dangerouslySetInnerHTML={{
              __html: configContent.replace(/("mcpnow"\s*:\s*{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*})/gs, '<span class="bg-blue-50 border-l-2 border-blue-500 pl-2 block">$1</span>')
            }} />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};