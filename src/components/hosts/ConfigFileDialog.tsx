
import { useState, useEffect } from "react";
import { Save, AlertTriangle } from "lucide-react";
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
}

export function ConfigFileDialog({
  open,
  onOpenChange,
  configPath,
  initialConfig,
  onSave,
  profileEndpoint
}: ConfigFileDialogProps) {
  const [config, setConfig] = useState(initialConfig);
  const [error, setError] = useState<string | null>(null);
  const [isModified, setIsModified] = useState(false);
  const [hasEndpointMismatch, setHasEndpointMismatch] = useState(false);
  const { toast } = useToast();

  // Update config when initialConfig changes
  useEffect(() => {
    setConfig(initialConfig);
    setIsModified(false);
  }, [initialConfig, open]);

  // Check if the config has an endpoint that doesn't match the profile's endpoint
  useEffect(() => {
    if (profileEndpoint && config) {
      try {
        const parsedConfig = JSON.parse(config);
        
        // Check for endpoint mismatch in common config formats
        let configHasEndpoint = false;
        let configEndpoint = "";
        
        if (parsedConfig.endpoint) {
          configHasEndpoint = true;
          configEndpoint = parsedConfig.endpoint;
        } else if (parsedConfig.connectionDetails) {
          configHasEndpoint = true;
          configEndpoint = parsedConfig.connectionDetails;
        } else if (parsedConfig.url) {
          configHasEndpoint = true;
          configEndpoint = parsedConfig.url;
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
      setError(null);
      onSave(config);
      
      toast({
        title: "Configuration saved",
        description: `Config file saved to ${configPath}`,
      });
      
      setIsModified(false);
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

  const formatJson = () => {
    try {
      const parsed = JSON.parse(config);
      setConfig(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Cannot format: ${err.message}`);
      } else {
        setError("Cannot format: Invalid JSON");
      }
    }
  };

  // Handle dialog close with unsaved changes
  const handleCloseDialog = (open: boolean) => {
    if (!open && isModified) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        onOpenChange(false);
      }
    } else {
      onOpenChange(open);
    }
  };

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
            <div className="text-sm text-muted-foreground">Edit the configuration below:</div>
            <Button variant="outline" size="sm" onClick={formatJson}>
              Format JSON
            </Button>
          </div>
          
          {hasEndpointMismatch && (
            <Alert variant="destructive" className="py-2 px-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Warning: The endpoint in this configuration does not match the selected profile's endpoint.
              </AlertDescription>
            </Alert>
          )}
          
          <ScrollArea className="h-[400px] border rounded-md">
            <Textarea 
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
