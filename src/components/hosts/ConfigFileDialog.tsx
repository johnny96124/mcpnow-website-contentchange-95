
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConfigFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configPath: string;
  initialConfig: string;
  onSave: (config: string) => void;
}

export function ConfigFileDialog({
  open,
  onOpenChange,
  configPath,
  initialConfig,
  onSave,
}: ConfigFileDialogProps) {
  const [config, setConfig] = useState(initialConfig);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Update config when initialConfig changes
  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

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
      
      onOpenChange(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Invalid JSON format: ${err.message}`);
      } else {
        setError("Invalid JSON format");
      }
    }
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

  // Function to convert JSON to syntax highlighted HTML
  const renderHighlightedJson = () => {
    try {
      // Simple JSON syntax highlighting
      return config
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
          let cls = 'text-blue-500'; // default for numbers
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'text-gray-800 font-bold dark:text-gray-300'; // keys
            } else {
              cls = 'text-green-600 dark:text-green-400'; // strings
            }
          } else if (/true|false/.test(match)) {
            cls = 'text-purple-600 dark:text-purple-400'; // booleans
          } else if (/null/.test(match)) {
            cls = 'text-red-600 dark:text-red-400'; // null
          }
          return `<span class="${cls}">${match}</span>`;
        });
    } catch (e) {
      return config;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          
          <ScrollArea className="h-[400px] border rounded-md">
            <Textarea 
              className="flex-1 font-mono text-sm min-h-[400px] border-0 resize-none"
              value={config} 
              onChange={(e) => setConfig(e.target.value)}
              spellCheck={false}
            />
          </ScrollArea>
          
          {error && (
            <div className="text-destructive text-sm bg-destructive/10 p-2 rounded border border-destructive/20">
              {error}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
