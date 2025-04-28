
import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

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
  const configRef = useRef<HTMLPreElement>(null);

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

  useEffect(() => {
    if (!configRef.current) return;
    
    try {
      const container = configRef.current;
      const highlightMcpNowSection = (json: string) => {
        try {
          const parsed = JSON.parse(json);
          let formatted = JSON.stringify(parsed, null, 2);
          const mcpnowRegex = /"mcpnow"\s*:\s*{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}/gs;
          
          formatted = formatted.replace(mcpnowRegex, (match) => {
            return `<span class="bg-blue-50 border-l-2 border-blue-500 pl-2 block">${match}</span>`;
          });
          
          return formatted;
        } catch (e) {
          return json;
        }
      };
      
      container.innerHTML = highlightMcpNowSection(configContent);
    } catch (e) {
      console.error("Error highlighting config:", e);
    }
  }, [configContent]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            View Configuration
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground mt-1">
            View configuration file details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Configuration File Path</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    MCP now use the default path for each host
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="w-full rounded-md border bg-muted/40 px-3 py-2">
              <pre className="text-sm font-mono">{configPath}</pre>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Configuration Details</h3>
            <div className="w-full rounded-md border">
              <pre 
                ref={configRef}
                className="p-4 text-sm font-mono whitespace-pre overflow-auto"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-8"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

