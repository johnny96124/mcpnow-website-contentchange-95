
import { useState } from "react";
import { Save } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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
          <Textarea 
            className="flex-1 font-mono text-sm min-h-[350px]"
            value={config} 
            onChange={(e) => setConfig(e.target.value)}
            spellCheck={false}
          />
          
          {error && (
            <div className="text-destructive text-sm bg-destructive/10 p-2 rounded border border-destructive/20">
              {error}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 mt-2">
          <Button variant="outline" onClick={formatJson}>
            Format JSON
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
