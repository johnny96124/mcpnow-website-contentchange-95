
import React, { useState, useEffect } from "react";
import { Search, Clock, Info, Loader2, X } from "lucide-react";
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
import { NoSearchResults } from "@/components/hosts/NoSearchResults";

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
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<ServerDefinition | ServerInstance>>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSelectedTab("discovery");
      setSelectedServer(null);
      setShowInstanceDialog(false);
      setShowCustomServerDialog(false);
      setHasSearched(false);
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

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate search delay
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      
      // Search in server definitions
      const matchingDefinitions = serverDefinitions.filter(server =>
        server.name.toLowerCase().includes(query) || 
        server.description.toLowerCase().includes(query)
      );
      
      // Search in existing instances
      const matchingInstances = existingInstances.filter(server =>
        server.name.toLowerCase().includes(query) ||
        (server.description && server.description.toLowerCase().includes(query))
      );
      
      setSearchResults([...matchingDefinitions, ...matchingInstances]);
      setIsSearching(false);
    }, 500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    setHasSearched(false);
    setSearchResults([]);
  };
  
  const getServerTypeDescription = (type: string) => {
    switch (type) {
      case 'HTTP_SSE': return 'HTTP Server-Sent Events';
      case 'STDIO': return 'Standard Input/Output';
      case 'WS': return 'WebSocket';
      default: return type;
    }
  };

  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
          <p className="ml-2 text-muted-foreground">Searching servers...</p>
        </div>
      );
    }
    
    if (searchResults.length === 0) {
      return (
        <NoSearchResults query={searchQuery} onClear={clearSearch} entityName="servers" />
      );
    }
    
    return (
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            {searchResults.length} results for "{searchQuery}"
          </p>
          <Button variant="ghost" size="sm" onClick={clearSearch} className="h-7 px-2">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
        
        <div className="space-y-3">
          {searchResults.map((server) => {
            const isInstance = 'connectionDetails' in server;
            const serverType = isInstance 
              ? serverDefinitions.find(def => def.id === (server as ServerInstance).definitionId)?.type || 'Custom'
              : (server as ServerDefinition).type;
            
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
                    <EndpointLabel type={serverType} />
                    {isInstance && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Instance
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {isInstance ? (
                      <div className="flex flex-col space-y-1">
                        {(server as EnhancedServerInstance).description && (
                          <span>{(server as EnhancedServerInstance).description}</span>
                        )}
                        <span className="flex items-center">
                          <Info className="h-3 w-3 mr-1" /> 
                          {(server as ServerInstance).connectionDetails}
                        </span>
                        {(server as EnhancedServerInstance).addedAt && (
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> 
                            Added on {format((server as EnhancedServerInstance).addedAt!, "MMM dd, yyyy")}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-1">
                        <span>{(server as ServerDefinition).description}</span>
                        <span className="text-xs text-primary-foreground/70 bg-primary/10 px-2 py-0.5 rounded-full inline-block w-fit">
                          {getServerTypeDescription(serverType)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const filteredServers = selectedTab === "added"
    ? existingInstances
    : serverDefinitions;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="flex justify-between items-center text-base">
              <span>Find Server</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCustomServerDialog(true)}
              >
                Add Custom
              </Button>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Search for a server to add to your profile
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 pt-4 space-y-4">
            {/* Enhanced Search Bar */}
            <div className="relative">
              <div className="flex items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search servers by name, type or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-10 pr-10 py-5 text-sm"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="absolute right-10 top-2 h-6 w-6 p-0 rounded-full"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear</span>
                    </Button>
                  )}
                </div>
                <Button 
                  onClick={handleSearch}
                  className="ml-2"
                  disabled={!searchQuery || isSearching}
                >
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
              </div>
              {!hasSearched && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Try searching for "PostgreSQL", "Redis", "database" or any other server you need
                </p>
              )}
            </div>
            
            <ScrollArea className="h-[400px] -mr-6 pr-6">
              {hasSearched ? (
                renderSearchResults()
              ) : (
                <>
                  {/* Navigation tabs shown only when not in search results */}
                  <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full mb-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="discovery" className="text-xs">Discovery</TabsTrigger>
                      <TabsTrigger value="added" className="text-xs">Added</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="space-y-4">
                    <div className="text-sm font-medium">
                      {selectedTab === "discovery" ? "Available Servers" : "Previously Added"}
                    </div>
                    {filteredServers.map((server) => {
                      const isAddedTab = selectedTab === "added";
                      const definition = isAddedTab ? 
                        serverDefinitions.find(def => def.id === server.definitionId) : 
                        null;
                      
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
                </>
              )}
            </ScrollArea>
          </div>

          <DialogFooter className="p-4 border-t">
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
        open={showCustomServerDialog}
        onOpenChange={setShowCustomServerDialog}
        onAddServer={handleAddCustomServer}
      />
    </>
  );
};
