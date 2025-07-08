
import React, { useState, useEffect, useRef } from "react";
import { Search, Clock, ExternalLink, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { serverDefinitions, type ServerInstance, type ServerDefinition } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { AddInstanceDialog } from "@/components/servers/AddInstanceDialog";
import { AddServerDialog } from "@/components/new-layout/AddServerDialog";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface ServerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServers: (servers: ServerInstance[]) => void;
  onStartAIChat?: (context: any) => void;
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
  onStartAIChat,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerDefinition | null>(null);
  const [showInstanceDialog, setShowInstanceDialog] = useState(false);
  const [showCustomServerDialog, setShowCustomServerDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Filtered results based on search query
  const filteredExistingInstances = searchQuery 
    ? existingInstances.filter(server => 
        server.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
    
  const filteredServerDefinitions = searchQuery
    ? serverDefinitions.filter(server => 
        server.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
    
  const hasSearchResults = filteredExistingInstances.length > 0 || filteredServerDefinitions.length > 0;
  
  // Clear state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setIsSearching(false);
      setSelectedServer(null);
      setShowInstanceDialog(false);
      setShowCustomServerDialog(false);
    } else {
      // Focus search input when dialog opens
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  }, [open]);

  // Handle existing instance selection
  const handleAddExistingInstance = (instance: EnhancedServerInstance) => {
    onAddServers([instance]);
    toast({
      title: "Server added",
      description: `${instance.name} has been added to your profile`
    });
    onOpenChange(false);
  };

  // Handle discovery server setup
  const handleSetupServer = (server: ServerDefinition) => {
    setSelectedServer(server);
    setShowInstanceDialog(true);
  };

  // Handle instance creation
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

  // Handle custom server addition
  const handleAddCustomServer = (server: ServerInstance) => {
    onAddServers([server]);
    toast({
      title: "Custom server added",
      description: `${server.name} has been added to your profile`
    });
    setShowCustomServerDialog(false);
    onOpenChange(false);
  };

  // Navigate to Discovery page
  const handleNavigateToDiscovery = () => {
    onOpenChange(false);
    navigate("/discovery");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Search and Add Server</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search by server name, tag, or description"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearching(e.target.value.length > 0);
                }}
                className="pl-8 text-sm"
              />
            </div>
            
            {!isSearching && (
              <p className="text-muted-foreground">
                If you cannot find the target server, you can choose to explore new servers in{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary font-medium"
                  onClick={handleNavigateToDiscovery}
                >
                  Discovery
                </Button>{" "}
                or{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary font-medium"
                  onClick={() => setShowCustomServerDialog(true)}
                >
                  Add Custom Server
                </Button>.
              </p>
            )}
            
            {isSearching && (
              <ScrollArea className="max-h-[400px] overflow-auto pr-2">
                {filteredExistingInstances.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Added Servers</h3>
                    <div className="space-y-2">
                      {filteredExistingInstances.map((instance) => (
                        <div
                          key={instance.id}
                          className="flex items-start justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-start space-x-4">
                            <ServerLogo name={instance.name} className="flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm truncate">{instance.name}</h4>
                                <EndpointLabel 
                                  type={serverDefinitions.find(def => def.id === instance.definitionId)?.type || 'Custom'} 
                                />
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                <div className="flex flex-col space-y-1">
                                  {instance.description && (
                                    <span>{instance.description}</span>
                                  )}
                                  {instance.addedAt && (
                                    <span className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" /> 
                                      Added on {format(instance.addedAt, "MMM dd, yyyy")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => handleAddExistingInstance(instance)}
                          >
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredServerDefinitions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Discovery Results</h3>
                    <div className="space-y-2">
                      {filteredServerDefinitions.map((server) => (
                        <div
                          key={server.id}
                          className="flex items-start justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-start space-x-4">
                            <ServerLogo name={server.name} className="flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm truncate">{server.name}</h4>
                                <EndpointLabel type={server.type} />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {server.description}
                              </p>
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => handleSetupServer(server)}
                          >
                            Setup
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!hasSearchResults && (
                  <div className="text-center py-8 border border-dashed rounded-md">
                    <p className="text-sm text-muted-foreground mb-2">No servers found matching "{searchQuery}"</p>
                    <p className="text-sm text-muted-foreground">
                      Try searching with different keywords or{" "}
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-primary"
                        onClick={() => setShowCustomServerDialog(true)}
                      >
                        add a custom server
                      </Button>
                    </p>
                  </div>
                )}
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AddInstanceDialog
        open={showInstanceDialog}
        onOpenChange={setShowInstanceDialog}
        serverDefinition={selectedServer}
        onCreateInstance={handleCreateInstance}
        onStartAIChat={onStartAIChat}
      />

      <AddServerDialog
        open={showCustomServerDialog}
        onOpenChange={setShowCustomServerDialog}
        onAddServer={handleAddCustomServer}
      />
    </>
  );
};
