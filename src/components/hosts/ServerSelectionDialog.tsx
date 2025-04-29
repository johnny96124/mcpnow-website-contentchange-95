import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { serverDefinitions, type ServerInstance, type ServerDefinition, type EndpointType, type Status } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { AddInstanceDialog } from "@/components/servers/AddInstanceDialog";
import { AddServerDialog } from "@/components/new-layout/AddServerDialog";

interface ServerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServers: (servers: ServerInstance[]) => void;
}

// Mock data with descriptions for existing instances
const existingInstances: Array<ServerInstance & { description?: string }> = [
  {
    id: "instance-1",
    name: "Local PostgreSQL",
    definitionId: "def-http-sse",
    status: "stopped",
    connectionDetails: "https://localhost:5432",
    enabled: false,
    description: "Local PostgreSQL database server instance"
  },
  {
    id: "instance-2",
    name: "Development Redis",
    definitionId: "def-stdio",
    status: "stopped",
    connectionDetails: "redis://localhost:6379",
    enabled: false,
    description: "Development Redis cache server"
  }
];

export const ServerSelectionDialog: React.FC<ServerSelectionDialogProps> = ({
  open,
  onOpenChange,
  onAddServers,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("discovery");
  const [selectedServer, setSelectedServer] = useState<ServerDefinition | null>(null);
  const [showInstanceDialog, setShowInstanceDialog] = useState(false);
  const [showAddServerDialog, setShowAddServerDialog] = useState(false);
  const { toast } = useToast();

  // Reset when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSelectedTab("discovery");
      setSelectedServer(null);
      setShowInstanceDialog(false);
      setShowAddServerDialog(false);
    }
  }, [open]);

  const handleServerSelect = (server: ServerDefinition | ServerInstance) => {
    if (selectedTab === "added") {
      // If it's an existing instance, add it directly
      const serverInstance = server as ServerInstance;
      onAddServers([serverInstance]);
      toast({
        title: "Server added",
        description: `${serverInstance.name} has been added to your profile`
      });
      onOpenChange(false);
    } else {
      // If it's a definition, show the instance dialog
      setSelectedServer(server as ServerDefinition);
      setShowInstanceDialog(true);
    }
  };

  const handleCreateInstance = (data: any) => {
    const newInstance: ServerInstance = {
      id: `instance-${Date.now()}`,
      name: data.name,
      definitionId: selectedServer?.id || "",
      status: "stopped",
      connectionDetails: data.url || data.args || "",
      enabled: false
    };

    onAddServers([newInstance]);
    toast({
      title: "Server instance created",
      description: `${newInstance.name} has been added to your profile`
    });
    setShowInstanceDialog(false);
    onOpenChange(false);
  };

  const handleAddCustomServer = () => {
    setShowAddServerDialog(true);
  };

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
    
    setShowAddServerDialog(false);
  };

  const filteredServers = selectedTab === "added"
    ? existingInstances.filter(server =>
        server.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : serverDefinitions.filter(server =>
        server.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Select Server</DialogTitle>
              <Button 
                onClick={handleAddCustomServer} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Custom Server
              </Button>
            </div>
            <DialogDescription>
              Choose a server to add to your profile
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search servers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="discovery">Discovery</TabsTrigger>
                <TabsTrigger value="added">Added</TabsTrigger>
              </TabsList>
            </Tabs>

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {filteredServers.map((server) => {
                  const definition = serverDefinitions.find(def => def.id === server.definitionId);
                  
                  return (
                    <div
                      key={server.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg hover:border-primary hover:bg-accent/5 cursor-pointer transition-colors"
                      onClick={() => handleServerSelect(server)}
                    >
                      <ServerLogo name={server.name} className="flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate">{server.name}</h4>
                          {definition && (
                            <EndpointLabel type={definition.type} />
                          )}
                        </div>
                        {(selectedTab === "discovery" && 'description' in server || 
                         selectedTab === "added" && server.description) && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedTab === "discovery" 
                              ? (server as any).description 
                              : server.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filteredServers.length === 0 && (
                  <div className="text-center py-8 border border-dashed rounded-md">
                    <p className="text-muted-foreground">No servers found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddInstanceDialog
        open={showInstanceDialog}
        onOpenChange={setShowInstanceDialog}
        serverDefinition={selectedServer}
        onCreateInstance={handleCreateInstance}
      />
      
      <AddServerDialog
        open={showAddServerDialog}
        onOpenChange={setShowAddServerDialog}
        onCreateServer={handleCreateServer}
        onNavigateToDiscovery={() => {}}
      />
    </>
  );
};
