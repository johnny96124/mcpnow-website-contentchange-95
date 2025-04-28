import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  serverDefinitions, 
  ServerDefinition,
  serverInstances,
  ServerInstance
} from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { Badge } from "@/components/ui/badge";
import { OfficialBadge } from "@/components/discovery/OfficialBadge";
import { AddInstanceDialog } from "@/components/servers/AddInstanceDialog";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ArrowLeft, Check, Server } from "lucide-react";
import { useHostProfiles } from "@/hooks/useHostProfiles";

interface ServerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostId: string;
  profileId: string;
}

interface InstanceFormValues {
  name: string;
  url?: string;
  commandArgs?: string;
  environment?: Record<string, string>;
  headers?: Record<string, string>;
}

export function ServerSelectionDialog({ 
  open, 
  onOpenChange,
  hostId,
  profileId
}: ServerSelectionDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyWithInstances, setShowOnlyWithInstances] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerDefinition | null>(null);
  const [instancesForServer, setInstancesForServer] = useState<ServerInstance[]>([]);
  const [showAddInstanceDialog, setShowAddInstanceDialog] = useState(false);
  const [showInstanceSelection, setShowInstanceSelection] = useState(false);
  const { addInstanceToProfile, getProfileById } = useHostProfiles();
  
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setSelectedServer(null);
      setInstancesForServer([]);
      setShowInstanceSelection(false);
    }
  }, [open]);
  
  const filteredServers = serverDefinitions.filter(server => {
    const matchesSearch = 
      server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (server.description && server.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (showOnlyWithInstances) {
      const hasInstances = serverInstances.some(instance => 
        instance.definitionId === server.id
      );
      return matchesSearch && hasInstances;
    }
    
    return matchesSearch;
  });
  
  const handleServerSelect = (server: ServerDefinition) => {
    setSelectedServer(server);
    
    const instances = serverInstances.filter(
      instance => instance.definitionId === server.id
    );
    
    setInstancesForServer(instances);
    
    if (instances.length > 0) {
      setShowInstanceSelection(true);
    } else {
      setShowAddInstanceDialog(true);
    }
  };
  
  const handleInstanceSelect = (instance: ServerInstance) => {
    if (profileId) {
      const updatedProfile = addInstanceToProfile(profileId, instance.id);
      
      if (updatedProfile) {
        toast.success(`Added ${instance.name} to profile`);
        onOpenChange(false);
      } else {
        toast.error("Failed to add server to profile");
      }
    } else {
      toast.error("No profile selected");
    }
  };
  
  const handleCreateInstance = (data: InstanceFormValues) => {
    if (!selectedServer) return;
    
    console.log("Creating instance:", data);
    
    const newInstance: ServerInstance = {
      id: `instance-${Date.now()}`,
      name: data.name,
      definitionId: selectedServer.id,
      status: "stopped",
      connectionDetails: data.url || data.commandArgs || "",
      environment: data.environment,
      arguments: data.commandArgs ? [data.commandArgs] : undefined,
      url: data.url,
      headers: data.headers,
      enabled: true
    };
    
    if (profileId) {
      const updatedProfile = addInstanceToProfile(profileId, newInstance.id);
      
      if (updatedProfile) {
        toast.success(`Created and added ${data.name} to profile`);
        onOpenChange(false);
      } else {
        toast.error("Failed to add server to profile");
      }
    } else {
      toast.error("No profile selected");
    }
    
    setShowAddInstanceDialog(false);
  };
  
  const renderInstanceSelection = () => {
    return (
      <>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInstanceSelection(false)}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle>Select Instance</DialogTitle>
          </div>
          <DialogDescription>
            Select an existing instance of {selectedServer?.name} to add to your profile
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="mt-4 max-h-[400px] pr-4">
          <div className="space-y-3">
            {instancesForServer.map(instance => (
              <div
                key={instance.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/30 cursor-pointer transition-colors"
                onClick={() => handleInstanceSelect(instance)}
              >
                <div className="flex items-center space-x-3">
                  <ServerLogo name={instance.name} />
                  <div>
                    <div className="font-medium">{instance.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {instance.url || instance.connectionDetails}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setShowInstanceSelection(false);
              setShowAddInstanceDialog(true);
            }}
          >
            Create New Instance Instead
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </>
    );
  };
  
  const renderServerSelection = () => {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Add Server</DialogTitle>
          <DialogDescription>
            Select a server to add to your profile
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search servers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="instance-filter"
              checked={showOnlyWithInstances}
              onCheckedChange={setShowOnlyWithInstances}
            />
            <Label htmlFor="instance-filter">Only show servers with existing instances</Label>
          </div>
        </div>
        
        <ScrollArea className="max-h-[400px] pr-4">
          {filteredServers.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">No servers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredServers.map((server) => {
                const hasInstances = serverInstances.some(
                  instance => instance.definitionId === server.id
                );
                
                return (
                  <div
                    key={server.id}
                    className="flex items-start p-4 border rounded-lg hover:bg-accent/30 cursor-pointer transition-colors"
                    onClick={() => handleServerSelect(server)}
                  >
                    <ServerLogo name={server.name} className="mr-3" />
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium">{server.name}</h3>
                        <EndpointLabel type={server.type} />
                        {server.isOfficial && <OfficialBadge />}
                        {hasInstances && (
                          <Badge variant="outline" className="bg-primary/5 text-xs">
                            Added
                          </Badge>
                        )}
                      </div>
                      {server.description && (
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {server.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </>
    );
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          {showInstanceSelection ? renderInstanceSelection() : renderServerSelection()}
        </DialogContent>
      </Dialog>
      
      {selectedServer && (
        <AddInstanceDialog
          open={showAddInstanceDialog}
          onOpenChange={setShowAddInstanceDialog}
          serverDefinition={selectedServer}
          onCreateInstance={handleCreateInstance}
        />
      )}
    </>
  );
}
