
import { useState, useEffect, useRef } from "react";
import { Save, AlertTriangle, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConfigFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configPath: string;
  initialConfig: string;
  onSave: (config: string) => void;
  profileEndpoint?: string;
  needsUpdate?: boolean;
}

export function ConfigFileDialog({
  open,
  onOpenChange,
  configPath,
  initialConfig,
  onSave,
  profileEndpoint,
  needsUpdate = false
}: ConfigFileDialogProps) {
  const [config, setConfig] = useState(initialConfig);
  const [error, setError] = useState<string | null>(null);
  const [isModified, setIsModified] = useState(false);
  const [hasEndpointMismatch, setHasEndpointMismatch] = useState(false);
  const [originalConfig, setOriginalConfig] = useState(initialConfig);
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Update config when initialConfig changes or dialog opens
  useEffect(() => {
    if (open && initialConfig) {
      setConfig(initialConfig);
      setOriginalConfig(initialConfig);
      setIsModified(false);
      setError(null); // Clear any previous errors
    }
  }, [initialConfig, open]);

  // Check if the config has an endpoint that doesn't match the profile's endpoint
  useEffect(() => {
    if (profileEndpoint && config) {
      try {
        const parsedConfig = JSON.parse(config);
        
        // Check for endpoint mismatch in mcpnow configuration
        let configHasEndpoint = false;
        let configEndpoint = "";
        
        if (parsedConfig.mcpServers?.mcpnow?.args) {
          const args = parsedConfig.mcpServers.mcpnow.args;
          const endpointIndex = args.length - 1;
          if (endpointIndex >= 0) {
            configHasEndpoint = true;
            configEndpoint = args[endpointIndex];
          }
        }
        
        setHasEndpointMismatch(
          configHasEndpoint && 
          configEndpoint !== profileEndpoint &&
          configEndpoint.trim() !== ""
        );
      } catch (e) {
        // Silently fail, validation error will be shown separately
      }
    }
  }, [config, profileEndpoint]);

  const handleSave = () => {
    try {
      // Validate JSON format
      JSON.parse(config);

      // Check for endpoint mismatch before saving
      if (hasEndpointMismatch) {
        setError("Cannot save: The endpoint in the mcpnow configuration doesn't match the selected profile's endpoint.");
        return;
      }
      
      setError(null);
      onSave(config);
      
      // No need for toast here as it's handled in the parent component
      
      // Reset states
      setIsModified(false);
      
      // Close dialog and reset state
      onOpenChange(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Invalid JSON format: ${err.message}`);
      } else {
        setError("Invalid JSON format");
      }
    }
  };

  const handleChange = (value: string) => {
    setConfig(value);
    setIsModified(true);
  };

  // Generate the default system configuration based on profile endpoint
  const generateDefaultConfig = () => {
    const defaultConfig = {
      mcpServers: {
        mcpnow: {
          command: "npx",
          args: [
            "-y",
            "@modelcontextprotocol/mcpnow",
            profileEndpoint || "http://localhost:8008/mcp"
          ]
        }
      }
    };
    
    return JSON.stringify(defaultConfig, null, 2);
  };

  const resetJson = () => {
    try {
      // Set the textarea to show the default system configuration
      const defaultSystemConfig = generateDefaultConfig();
      setConfig(defaultSystemConfig);
      setIsModified(true);
      setHasEndpointMismatch(false);
      setError(null);
      
      toast({
        title: "Configuration reset",
        description: "The configuration has been reset to system defaults.",
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(`Cannot reset: ${err.message}`);
      } else {
        setError("Cannot reset: Invalid JSON");
      }
    }
  };

  // Apply syntax highlighting for mcpnow section (not implemented for textarea)
  useEffect(() => {
    if (!textareaRef.current) return;
    
    try {
      // Implementation for highlighting would typically use a proper code editor component
      const parsedConfig = JSON.parse(config);
      if (parsedConfig.mcpServers?.mcpnow) {
        // For a textarea, we can't apply direct highlighting
      }
    } catch (e) {
      // Silently fail, validation error will be shown separately
    }
  }, [config]);

  // Handle dialog close with unsaved changes
  const handleCloseDialog = (open: boolean) => {
    if (!open && isModified) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        onOpenChange(false);
        // Reset modified state to prevent dialog from appearing again
        setIsModified(false);
      }
    } else {
      onOpenChange(open);
    }
  };

  // Only show the warning when both hasEndpointMismatch is true AND needsUpdate is true
  const showWarning = hasEndpointMismatch && needsUpdate;

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Config File</DialogTitle>
          <DialogDescription>
            {configPath}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 min-h-[400px] flex flex-col space-y-3 mt-2">
          <div className="flex justify-between mb-2">
            <div className="text-sm text-muted-foreground">
              Edit the configuration below. <span className="font-medium text-primary">The mcpnow section is important and must match your profile.</span>
            </div>
            <Button variant="outline" size="sm" onClick={resetJson}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset JSON
            </Button>
          </div>
          
          {showWarning && (
            <Alert variant="destructive" className="py-2 px-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Warning: The endpoint in the mcpnow configuration does not match the selected profile's endpoint.
                Click "Reset JSON" to fix this issue.
              </AlertDescription>
            </Alert>
          )}
          
          <ScrollArea className="h-[400px] border rounded-md">
            <Textarea 
              ref={textareaRef}
              className="flex-1 font-mono text-sm min-h-[400px] border-0 resize-none"
              value={config} 
              onChange={(e) => handleChange(e.target.value)}
              spellCheck={false}
            />
          </ScrollArea>
          
          {error && (
            <div className="text-destructive text-sm bg-destructive/10 p-2 rounded border border-destructive/20">
              {error}
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-end space-x-2">
          <Button onClick={handleSave} disabled={!!error}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
