
import React, { useState, useEffect } from "react";
import { Search, Clock } from "lucide-react";
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
import { format } from "date-fns";

interface ServerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServers: (servers: ServerInstance[]) => void;
}

// Enhanced instance type with additional metadata
interface EnhancedServerInstance extends ServerInstance {
  description?: string;
  addedAt?: Date;
}

const existingInstances: EnhancedServerInstance[] = [
  {
    id: "instance-1",
    name: "Local PostgreSQL",
    definitionId: "def-http-sse",
    status: "stopped",
    connectionDetails: "https://localhost:5432",
    enabled: false,
    description: "Local PostgreSQL database server instance",
    addedAt: new Date(2025, 3, 20) // April 20, 2025
  },
  {
    id: "instance-2",
    name: "Development Redis",
    definitionId: "def-stdio",
    status: "stopped",
    connectionDetails: "redis://localhost:6379",
    enabled: false,
    description: "Development Redis cache server",
    addedAt: new Date(2025, 3, 25) // April 25, 2025
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
  const [showCustomServerDialog, setShowCustomServerDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSelectedTab("discovery");
      setSelectedServer(null);
      setShowInstanceDialog(false);
      setShowCustomServerDialog(false);
    }
  }, [open]);

  const handleServerSelect = (server: ServerDefinition | ServerInstance) => {
    if (selectedTab === "added") {
      const serverInstance = server as ServerInstance;
      onAddServers([serverInstance]);
      toast({
        title: "Server added",
        description: `${serverInstance.name} has been added to your profile`
      });
      onOpenChange(false);
    } else {
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

  const handleAddCustomServer = (server: ServerInstance) => {
    onAddServers([server]);
    toast({
      title: "Custom server added",
      description: `${server.name} has been added to your profile`
    });
    setShowCustomServerDialog(false);
    onOpenChange(false);
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
            <DialogTitle className="flex justify-between items-center text-base">
              <span>Select Server</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCustomServerDialog(true)}
              >
                Add Custom
              </Button>
            </DialogTitle>
            <DialogDescription className="text-xs">
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
                className="pl-8 text-sm"
              />
            </div>
            
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="discovery" className="text-xs">Discovery</TabsTrigger>
                <TabsTrigger value="added" className="text-xs">Added</TabsTrigger>
              </TabsList>
            </Tabs>

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {filteredServers.map((server) => {
                  const definition = selectedTab === "added" ? 
                    serverDefinitions.find(def => def.id === server.definitionId) : 
                    null;
                  const isAddedTab = selectedTab === "added";
                  
                  return (
                    <div
                      key={server.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg hover:border-primary hover:bg-accent/5 cursor-pointer transition-colors"
                      onClick={() => handleServerSelect(server)}
                    >
                      <ServerLogo name={server.name} className="flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm truncate">{server.name}</h4>
                          {isAddedTab ? (
                            <EndpointLabel 
                              type={definition?.type || 'Custom'} 
                            />
                          ) : (
                            <EndpointLabel 
                              type={(server as ServerDefinition).type} 
                            />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {isAddedTab ? (
                            <div className="flex flex-col space-y-1">
                              {(server as EnhancedServerInstance).description && (
                                <span>{(server as EnhancedServerInstance).description}</span>
                              )}
                              {(server as EnhancedServerInstance).addedAt && (
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" /> 
                                  Added on {format((server as EnhancedServerInstance).addedAt!, "MMM dd, yyyy")}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span>{(server as ServerDefinition).description}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredServers.length === 0 && (
                  <div className="text-center py-8 border border-dashed rounded-md">
                    <p className="text-sm text-muted-foreground">No servers found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <AddInstanceDialog
        open={showInstanceDialog}
        onOpenChange={setShowInstanceDialog}
        serverDefinition={selectedServer}
        onCreateInstance={handleCreateInstance}
      />

      <AddServerDialog
        open={showCustomServerDialog}
        onOpenChange={setShowCustomServerDialog}
        onAddServer={handleAddCustomServer}
      />
    </>
  );
};
