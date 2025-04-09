
import { useState, useEffect, useRef } from "react";
import { Save, AlertTriangle, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

interface ConfigFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configPath: string;
  initialConfig: string;
  onSave: (config: string, configPath: string) => void;
  profileEndpoint?: string;
  needsUpdate?: boolean;
  allowPathEdit?: boolean;
  isViewOnly?: boolean; // New prop to control view-only mode
}

export function ConfigFileDialog({
  open,
  onOpenChange,
  configPath,
  initialConfig,
  onSave,
  profileEndpoint,
  needsUpdate = false,
  allowPathEdit = false,
  isViewOnly = false // Default to false for backward compatibility
}: ConfigFileDialogProps) {
  const [config, setConfig] = useState(initialConfig);
  const [path, setPath] = useState(configPath);
  const [error, setError] = useState<string | null>(null);
  const [isModified, setIsModified] = useState(false);
  const [pathModified, setPathModified] = useState(false);
  const [hasEndpointMismatch, setHasEndpointMismatch] = useState(false);
  const [originalConfig, setOriginalConfig] = useState(initialConfig);
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Update config when initialConfig changes
  useEffect(() => {
    setConfig(initialConfig);
    setOriginalConfig(initialConfig);
    setIsModified(false);
  }, [initialConfig, open]);

  // Update path when configPath changes
  useEffect(() => {
    setPath(configPath);
    setPathModified(false);
  }, [configPath, open]);

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
      onSave(config, path);
      
      toast({
        title: "Configuration saved",
        description: `Config file saved to ${path}`,
      });
      
      setIsModified(false);
      setPathModified(false);
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

  const handlePathChange = (value: string) => {
    setPath(value);
    setPathModified(true);
  };

  // Generate the default system configuration based on profile endpoint
  const generateDefaultConfig = () => {
    // Create a default configuration structure
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

  // Apply syntax highlighting for mcpnow section
  useEffect(() => {
    if (!textareaRef.current) return;
    
    try {
      // Implementation for highlighting would typically be more complex with a proper editor
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
    if (!open && (isModified || pathModified) && !isViewOnly) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        onOpenChange(false);
      }
    } else {
      onOpenChange(open);
    }
  };

  // Fix endpoint mismatch automatically
  const handleFixEndpoint = () => {
    try {
      const parsedConfig = JSON.parse(config);
      
      if (parsedConfig.mcpServers?.mcpnow?.args && profileEndpoint) {
        const args = [...parsedConfig.mcpServers.mcpnow.args];
        // Update the endpoint (last argument)
        args[args.length - 1] = profileEndpoint;
        
        parsedConfig.mcpServers.mcpnow.args = args;
        const updatedConfig = JSON.stringify(parsedConfig, null, 2);
        
        setConfig(updatedConfig);
        setIsModified(true);
        setHasEndpointMismatch(false);
        setError(null);
        
        toast({
          title: "Endpoint updated",
          description: "The configuration endpoint has been updated to match the profile.",
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Cannot update endpoint: ${err.message}`);
      } else {
        setError("Cannot update endpoint: Invalid JSON");
      }
    }
  };

  // Only show the warning when both hasEndpointMismatch is true AND needsUpdate is true
  const showWarning = hasEndpointMismatch && needsUpdate;

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Config File</DialogTitle>
          <DialogDescription>
            {isViewOnly ? "View configuration file details" : "Edit configuration file details"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-3 mt-2">
          {/* Configuration File Path Section */}
          <div className="space-y-2">
            <Label htmlFor="configPath">Configuration File Path</Label>
            <Textarea
              id="configPath"
              value={path}
              onChange={(e) => handlePathChange(e.target.value)}
              rows={1}
              className="font-mono text-sm"
              readOnly={isViewOnly || !allowPathEdit}
            />
            {allowPathEdit && !isViewOnly && (
              <p className="text-xs text-muted-foreground">
                You can modify the path where this configuration will be saved.
              </p>
            )}
          </div>

          {!isViewOnly && (
            <div className="flex justify-between mb-2">
              <div className="text-sm text-muted-foreground">
                Edit the configuration below. <span className="font-medium text-primary">The mcpnow section is important and must match your profile.</span>
              </div>
              <Button variant="outline" size="sm" onClick={resetJson}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset JSON
              </Button>
            </div>
          )}
          
          {showWarning && (
            <Alert variant="destructive" className="py-2 px-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Warning: The endpoint in the mcpnow configuration does not match the selected profile's endpoint.
                {!isViewOnly ? " Click \"Reset JSON\" to fix this issue." : " This configuration needs to be updated."}
              </AlertDescription>
            </Alert>
          )}
          
          <ScrollArea className="h-[300px] border rounded-md">
            <Textarea 
              ref={textareaRef}
              className="flex-1 font-mono text-sm min-h-[300px] border-0 resize-none"
              value={config} 
              onChange={(e) => handleChange(e.target.value)}
              spellCheck={false}
              readOnly={isViewOnly}
            />
          </ScrollArea>
          
          {error && (
            <div className="text-destructive text-sm bg-destructive/10 p-2 rounded border border-destructive/20">
              {error}
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-end space-x-2">
          {isViewOnly ? (
            <>
              {hasEndpointMismatch && (
                <Button onClick={handleFixEndpoint} variant="destructive">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Fix Endpoint Mismatch
                </Button>
              )}
              <Button onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </>
          ) : (
            <Button onClick={handleSave} disabled={!!error}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
