
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export interface ConfigFileDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  configPath: string;
  initialConfig: string;
  onSave: (config: string, path: string) => void;
}

export function ConfigFileDialog({ 
  open, 
  onOpenChange, 
  configPath, 
  initialConfig = "", 
  onSave 
}: ConfigFileDialogProps) {
  const [configContent, setConfigContent] = useState<string>(initialConfig);

  const handleSave = () => {
    onSave(configContent, configPath);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Configuration File</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div>
            <p className="text-sm font-medium mb-1">Path</p>
            <div className="p-2 bg-muted rounded-md font-mono text-sm">
              {configPath}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Content</p>
            <Textarea 
              className="font-mono h-80 text-sm" 
              value={configContent} 
              onChange={(e) => setConfigContent(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
