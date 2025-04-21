import { useState, useEffect, useRef } from "react";
import { Save, AlertTriangle, RotateCw, RefreshCw, Settings, Check, Info } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { CloseIconButton } from "@/components/ui/CloseIconButton";

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
  isCreateMode?: boolean;
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
  isUpdateMode = false,
  isCreateMode = false
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

  useEffect(() => {
    setConfig(initialConfig);
    setOriginalConfig(initialConfig);
    setIsModified(false);
  }, [initialConfig, open]);

  useEffect(() => {
    setPath(configPath);
    setPathModified(false);
  }, [configPath, open]);

  useEffect(() => {
    if (profileEndpoint && config) {
      try {
        const parsedConfig = JSON.parse(config);
        
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
      }
    }
  }, [config, profileEndpoint]);

  const handleSave = () => {
    try {
      JSON.parse(config);

      if (hasEndpointMismatch) {
        setError("Cannot save: The endpoint in the mcpnow configuration doesn't match the selected profile's endpoint.");
        return;
      }
      
      setError(null);
      onSave(config, path);
      
      const successMessage = isCreateMode ? "Configuration created" : 
                             isUpdateMode ? "Configuration updated" : 
                             "Configuration saved";

      const successDesc = isCreateMode ? `New config file created at ${path}` :
                          isUpdateMode ? `Config file updated at ${path}` :
                          `Config file saved to ${path}`;
      
      toast({
        title: successMessage,
        description: successDesc,
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

  const handlePathEdit = (value: string) => {
    setPath(value);
    setPathModified(true);
  };

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

  const getFormattedConfig = () => {
    try {
      const parsed = JSON.parse(config);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return config;
    }
  };

  const handleCloseDialog = (open: boolean) => {
    if (!open && (isModified || pathModified) && !isViewOnly && !isFixMode && !isUpdateMode && !isCreateMode) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        onOpenChange(false);
      }
    } else {
      onOpenChange(open);
    }
  };

  const handleFixEndpoint = () => {
    try {
      const parsedConfig = JSON.parse(config);
      
      if (parsedConfig.mcpServers?.mcpnow?.args && profileEndpoint) {
        const args = [...parsedConfig.mcpServers.mcpnow.args];
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

  useEffect(() => {
    if (!configContainerRef.current) return;
    
    try {
      const container = configContainerRef.current;
      const highlightMcpNowSection = (json: string) => {
        try {
          const parsed = JSON.parse(json);
          
          let formatted = JSON.stringify(parsed, null, 2);
          
          const mcpnowRegex = /"mcpnow"\s*:\s*{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}/gs;
          
          formatted = formatted.replace(mcpnowRegex, (match) => {
            return `<span class="mcpnow-highlight bg-blue-50 border-l-2 border-blue-500 pl-2 block">${match}</span>`;
          });
          
          return formatted;
        } catch (e) {
          return json;
        }
      };
      
      if (isViewOnly || isFixMode || isUpdateMode || isCreateMode) {
        try {
          const parsed = JSON.parse(config);
          const formatted = JSON.stringify(parsed, null, 2);
          container.innerHTML = highlightMcpNowSection(formatted);
        } catch (e) {
          container.textContent = config;
        }
      }
    } catch (e) {
    }
  }, [config, isViewOnly, isFixMode, isUpdateMode, isCreateMode]);

  useEffect(() => {
    if ((isFixMode || isUpdateMode || isCreateMode) && open) {
      if (hasEndpointMismatch) {
        handleFixEndpoint();
      } else if (needsUpdate || isCreateMode) {
        resetJson();
      }
    }
  }, [isFixMode, isUpdateMode, isCreateMode, open, needsUpdate, hasEndpointMismatch]);

  const dialogTitle = isCreateMode ? "Create Configuration" :
                      isUpdateMode ? "Update Configuration" :
                      isFixMode ? "Fix Configuration" :
                      isViewOnly ? "View Configuration" : "Edit Configuration";
    
  const dialogDescription = isCreateMode ? "Create a new configuration file for your host" :
                           isUpdateMode ? "Update your configuration to match your selected profile" :
                           isFixMode ? "Fix your configuration to match your selected profile" :
                           isViewOnly ? "View configuration file details" :
                           "Edit configuration file details";

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[550px] overflow-y-auto max-h-[90vh] relative">
        <CloseIconButton onClick={() => onOpenChange(false)} />
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{dialogTitle}</DialogTitle>
          </div>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        
        {isCreateMode && (
          <Alert variant="default" className="bg-blue-50 border-blue-200 mb-4">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-700">Creating Host Configuration</AlertTitle>
            <AlertDescription className="text-blue-600">
              We'll create a configuration file for your host that will allow it to connect to your profiles.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex-1 flex flex-col space-y-3 mt-2">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="configPath" className="text-sm font-medium">Configuration File Path</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[250px]">
                    MCP now use the default path for each host
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {isCreateMode || isUpdateMode ? (
              <div className="bg-gray-50 border rounded-md px-3 py-2">
                <div className="font-mono text-sm break-all">{path}</div>
              </div>
            ) : (
              <Textarea
                id="configPath"
                value={path}
                onChange={(e) => handlePathEdit(e.target.value)}
                rows={1}
                className="font-mono text-sm"
                readOnly={isViewOnly || !allowPathEdit || isFixMode || isUpdateMode}
              />
            )}
            
            {allowPathEdit && !isViewOnly && !isFixMode && !isUpdateMode && !isCreateMode && (
              <p className="text-xs text-muted-foreground">
                You can modify the path where this configuration will be saved.
              </p>
            )}
          </div>

          <div className="mb-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="configDetails" className="text-sm font-medium">Configuration Details</Label>
              
              {!isViewOnly && !isFixMode && !isUpdateMode && !isCreateMode && (
                <Button variant="outline" size="sm" onClick={resetJson}>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
              )}
            </div>
            
            {isCreateMode && (
              <p className="text-sm text-muted-foreground mt-1">
                This is the default MCP configuration. The <span className="font-medium text-blue-600">mcpnow</span> section 
                is highlighted and contains the important settings.
              </p>
            )}
          </div>
          
          <ScrollArea className="h-[300px] border rounded-md">
            {isViewOnly || isFixMode || isUpdateMode || isCreateMode ? (
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
        
        <DialogFooter className="flex justify-end space-x-2">
          {isCreateMode ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!!error}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Check className="mr-2 h-4 w-4" />
                Create Configuration
              </Button>
            </>
          ) : isUpdateMode ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!!error || !isModified}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Update Configuration
              </Button>
            </>
          ) : isFixMode ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!!error || !isModified}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Settings className="mr-2 h-4 w-4" />
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
