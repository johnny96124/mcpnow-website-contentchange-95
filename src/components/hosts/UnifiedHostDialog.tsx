
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Host } from "@/data/mockData";

interface UnifiedHostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHosts: (hosts: Host[]) => void;
}

export const UnifiedHostDialog: React.FC<UnifiedHostDialogProps> = ({
  open,
  onOpenChange,
  onAddHosts
}) => {
  const [selectedHosts, setSelectedHosts] = useState<Host[]>([]);
  
  // Predefined host templates that users can add
  const hostTemplates: Host[] = [
    {
      id: "vscode",
      name: "VS Code",
      configStatus: "unknown",
      connectionStatus: "unknown",
      icon: "💻"
    },
    {
      id: "jetbrains",
      name: "JetBrains IDEs",
      configStatus: "unknown",
      connectionStatus: "unknown",
      icon: "🧩"
    },
    {
      id: "terminal",
      name: "Terminal",
      configStatus: "unknown",
      connectionStatus: "unknown",
      icon: "⌨️"
    }
  ];
  
  const handleAddSelected = () => {
    onAddHosts(selectedHosts);
    setSelectedHosts([]);
    onOpenChange(false);
  };
  
  const handleSelectHost = (host: Host) => {
    setSelectedHosts(prev => {
      const isAlreadySelected = prev.some(h => h.id === host.id);
      if (isAlreadySelected) {
        return prev.filter(h => h.id !== host.id);
      } else {
        return [...prev, host];
      }
    });
  };
  
  const isHostSelected = (hostId: string) => {
    return selectedHosts.some(h => h.id === hostId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Hosts</DialogTitle>
          <DialogDescription>
            Choose from available hosts to add to your workspace.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            {hostTemplates.map(host => (
              <div 
                key={host.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  isHostSelected(host.id) 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => handleSelectHost(host)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-muted/30 p-2 rounded-full">
                    <span className="text-xl">{host.icon || '🖥️'}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{host.name}</h3>
                    <p className="text-sm text-muted-foreground">Click to select</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddSelected} 
            disabled={selectedHosts.length === 0}
          >
            Add Selected ({selectedHosts.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
