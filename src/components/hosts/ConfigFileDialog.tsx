
import { useState, useEffect, useRef } from "react";
import { Save, AlertTriangle, RotateCw, RefreshCw, Settings } from "lucide-react";
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
  isViewOnly?: boolean;
  isFixMode?: boolean;
  isUpdateMode?: boolean;
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
  isViewOnly = false,
  isFixMode = false,
  isUpdateMode = false
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
  const configContainerRef = useRef<HTMLPreElement | null>(null);

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
        title: isUpdateMode ? "Configuration updated" : "Configuration saved",
        description: `Config file ${isUpdateMode ? "updated" : "saved"} to ${path}`,
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

  // Format the config with mcpnow highlighting
  const getFormattedConfig = () => {
    try {
      // Parse the JSON to ensure it's valid
      const parsed = JSON.parse(config);
      
      // Convert back to a string with formatting
      const formatted = JSON.stringify(parsed, null, 2);
      
      // Return the formatted string
      return formatted;
    } catch (e) {
      // If there's an error parsing, just return the raw config
      return config;
    }
  };

  // Handle dialog close with unsaved changes
  const handleCloseDialog = (open: boolean) => {
    if (!open && (isModified || pathModified) && !isViewOnly && !isFixMode && !isUpdateMode) {
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

  // Apply highlighting to mcpnow section
  useEffect(() => {
    if (!configContainerRef.current) return;
    
    try {
      const container = configContainerRef.current;
      const highlightMcpNowSection = (json: string) => {
        try {
          // Parse the JSON to get a structured representation
          const parsed = JSON.parse(json);
          
          // Convert back to a string with formatting
          let formatted = JSON.stringify(parsed, null, 2);
          
          // Replace the mcpnow section with highlighted version
          // This regex will match the "mcpnow" key and its entire object value including nested content
          const mcpnowRegex = /"mcpnow"\s*:\s*{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}/gs;
          
          formatted = formatted.replace(mcpnowRegex, (match) => {
            return `<span class="mcpnow-highlight">${match}</span>`;
          });
          
          return formatted;
        } catch (e) {
          // If parsing fails, return the original JSON
          return json;
        }
      };
      
      if (isViewOnly || isFixMode || isUpdateMode) {
        // Create a formatted display for readonly modes
        try {
          const parsed = JSON.parse(config);
          const formatted = JSON.stringify(parsed, null, 2);
          container.innerHTML = highlightMcpNowSection(formatted);
        } catch (e) {
          container.textContent = config;
        }
      }
    } catch (e) {
      // Silently fail, formatting is not critical
    }
  }, [config, isViewOnly, isFixMode, isUpdateMode]);

  // If in fix mode, set the config to a fixed version automatically
  useEffect(() => {
    if ((isFixMode || isUpdateMode) && open && hasEndpointMismatch) {
      handleFixEndpoint();
    } else if ((isFixMode || isUpdateMode) && open && needsUpdate) {
      resetJson();
    }
  }, [isFixMode, isUpdateMode, open, needsUpdate]);

  // Prepare title and description based on mode
  const dialogTitle = isUpdateMode ? "Update Configuration" : 
    (isFixMode ? "Fix Configuration" : (isViewOnly ? "View Configuration" : "Edit Configuration"));
    
  const dialogDescription = isUpdateMode ? "Update your configuration to match your selected profile" :
    (isFixMode ? "Fix your configuration to match your selected profile" :
    (isViewOnly ? "View configuration file details" : "Edit configuration file details"));

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-3 mt-2">
          {/* Configuration File Path Section */}
          <div className="space-y-2">
            <Label htmlFor="configPath">Configuration File Path</Label>
            <Textarea
              id="configPath"
              value={path}
              onChange={(e) => handlePathEdit(e.target.value)}
              rows={1}
              className="font-mono text-sm"
              readOnly={isViewOnly || !allowPathEdit || isFixMode || isUpdateMode}
            />
            {allowPathEdit && !isViewOnly && !isFixMode && !isUpdateMode && (
              <p className="text-xs text-muted-foreground">
                You can modify the path where this configuration will be saved.
              </p>
            )}
          </div>

          <div className="mb-2">
            <Label htmlFor="configDetails" className="text-sm font-medium">Config Details</Label>
            {!isViewOnly && !isFixMode && !isUpdateMode && (
              <div className="flex justify-between items-center mt-1 mb-2">
                <div className="text-sm text-muted-foreground">
                  Edit the configuration below. <span className="font-medium text-primary">The mcpnow section is important and must match your profile.</span>
                </div>
                <Button variant="outline" size="sm" onClick={resetJson}>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Reset JSON
                </Button>
              </div>
            )}
          </div>
          
          <ScrollArea className="h-[300px] border rounded-md">
            {/* Show textarea for editable mode, or pre for readonly mode */}
            {isViewOnly || isFixMode || isUpdateMode ? (
              <pre 
                ref={configContainerRef}
                className="font-mono text-sm p-4 whitespace-pre-wrap"
              >
                {getFormattedConfig()}
              </pre>
            ) : (
              <Textarea 
                ref={textareaRef}
                className="flex-1 font-mono text-sm min-h-[300px] border-0 resize-none"
                value={config} 
                onChange={(e) => handleChange(e.target.value)}
                spellCheck={false}
              />
            )}
          </ScrollArea>
          
          {error && !isViewOnly && (
            <div className="text-destructive text-sm bg-destructive/10 p-2 rounded border border-destructive/20">
              {error}
            </div>
          )}
        </div>
        
        {(isFixMode || isUpdateMode) && (
          <Alert className="bg-blue-50 border-blue-200 mt-2">
            <AlertDescription className="text-blue-700">
              We'll automatically update your configuration to match the selected profile. 
              Click "{isUpdateMode ? 'Update' : 'Fix'} Configuration" when ready.
            </AlertDescription>
          </Alert>
        )}
        
        <DialogFooter className="flex justify-end space-x-2">
          {isUpdateMode ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!!error || !isModified}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Update Configuration
              </Button>
            </>
          ) : isFixMode ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!!error || !isModified}>
                Fix Configuration
              </Button>
            </>
          ) : isViewOnly ? (
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
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
