
import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { serverDefinitions, type ServerInstance, type ServerDefinition } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { AddServerDialog } from "@/components/servers/AddServerDialog";

interface ServerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServers: (servers: ServerInstance[]) => void;
}

export const ServerSelectionDialog: React.FC<ServerSelectionDialogProps> = ({
  open,
  onOpenChange,
  onAddServers,
}) => {
  const [showAddServerDialog, setShowAddServerDialog] = useState(true);
  const { toast } = useToast();

  // Reset when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setShowAddServerDialog(false);
    } else {
      setShowAddServerDialog(true);
    }
  }, [open]);

  const handleCreateServer = (serverData: any) => {
    // Create a new server definition based on the serverData
    const newDefinition: ServerDefinition = {
      id: `def-${Date.now()}`,
      name: serverData.name,
      type: serverData.type,
      version: "1.0.0",
      description: serverData.description || "Custom server",
      downloads: 0,
      isOfficial: false
    };
    
    // Create a new server instance from the definition
    const newInstance: ServerInstance = {
      id: `instance-${Date.now()}`,
      name: serverData.name,
      definitionId: newDefinition.id,
      status: "stopped",
      connectionDetails: serverData.url || serverData.commandArgs || "",
      enabled: false
    };

    onAddServers([newInstance]);
    toast({
      title: "Custom server created",
      description: `${serverData.name} has been added to your profile`
    });
    
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Custom Server</DialogTitle>
            <DialogDescription>
              Create a local server to add to your profile
            </DialogDescription>
          </DialogHeader>
          
          <AddServerDialog
            open={showAddServerDialog}
            onOpenChange={setShowAddServerDialog}
            onAddServer={(server) => {
              onAddServers([server]);
              onOpenChange(false);
            }}
          />
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
