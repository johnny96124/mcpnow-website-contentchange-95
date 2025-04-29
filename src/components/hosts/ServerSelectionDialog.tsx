
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type ServerInstance } from "@/data/mockData";
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
    // Create a new server instance from the definition
    const newInstance: ServerInstance = {
      id: `instance-${Date.now()}`,
      name: serverData.name,
      definitionId: `def-${Date.now()}`,
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

  // No-op function since we've removed the discovery feature
  const handleNavigateToDiscovery = () => {
    // This function is no longer needed but still required by the component
    console.log("Discovery navigation requested but feature is disabled");
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
            onCreateServer={handleCreateServer}
            onNavigateToDiscovery={handleNavigateToDiscovery}
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
