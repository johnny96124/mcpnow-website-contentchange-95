
import React, { useState, useEffect } from "react";
import { 
  Search, X, Server, Plus, Check, ArrowRight, AlertTriangle, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { serverDefinitions, Profile, ServerInstance } from "@/data/mockData";

interface AddServerToHostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServers: (servers: ServerInstance[]) => void;
  profiles?: Profile[];
}

export const AddServerToHostDialog: React.FC<AddServerToHostDialogProps> = ({
  open,
  onOpenChange,
  onAddServers,
  profiles = []
}) => {
  const [activeTab, setActiveTab] = useState<"servers" | "profile">("servers");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServers, setSelectedServers] = useState<ServerInstance[]>([]);
  const [availableServers, setAvailableServers] = useState<ServerInstance[]>([]);
  const [discoveryServers, setDiscoveryServers] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  
  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedServers([]);
      setSearchQuery("");
      setSelectedProfileId("");
      
      // Create some mock available servers
      const mockServers: ServerInstance[] = [
        {
          id: "server-1",
          name: "Local HTTP Server",
          definitionId: "http-sse-server",
          status: "stopped",
          connectionDetails: "http://localhost:8008/mcp",
          enabled: true
        },
        {
          id: "server-2",
          name: "Python Model Server",
          definitionId: "stdio-server",
          status: "stopped",
          connectionDetails: "python3 server.py",
          enabled: true
        },
        {
          id: "server-3",
          name: "Node.js Server",
          definitionId: "http-sse-server",
          status: "stopped",
          connectionDetails: "node server.js",
          enabled: true
        }
      ];
      setAvailableServers(mockServers);
      
      // Mock discovery servers
      const mockDiscoveryServers = serverDefinitions.slice(0, 5).map(def => ({
        id: `discovery-${def.id}`,
        name: def.name,
        type: def.type,
        description: def.description,
        author: def.author,
        definitionId: def.id
      }));
      setDiscoveryServers(mockDiscoveryServers);
    }
  }, [open]);

  // Filter servers based on search query
  const filteredServers = availableServers.filter(server =>
    server.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredDiscoveryServers = discoveryServers.filter(server =>
    server.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get profile servers
  const getProfileServers = (profileId: string): ServerInstance[] => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return [];
    
    // In a real app, this would query the actual server instances
    return profile.instances.map(instanceId => ({
      id: instanceId,
      name: `Server ${instanceId.split('-')[1]}`,
      definitionId: "http-sse-server",
      status: "stopped",
      connectionDetails: "http://localhost:8008/mcp",
      enabled: true
    }));
  };
  
  const profileServers = getProfileServers(selectedProfileId);

  const handleToggleServer = (server: ServerInstance) => {
    if (selectedServers.some(s => s.id === server.id)) {
      setSelectedServers(selectedServers.filter(s => s.id !== server.id));
    } else {
      setSelectedServers([...selectedServers, server]);
    }
  };

  const handleAddDiscoveryServer = (server: any) => {
    // Create a server instance from the discovery server
    const newServer: ServerInstance = {
      id: server.id,
      name: server.name,
      definitionId: server.definitionId,
      status: "stopped",
      connectionDetails: "Newly added from discovery",
      enabled: true
    };
    
    if (!selectedServers.some(s => s.id === newServer.id)) {
      setSelectedServers([...selectedServers, newServer]);
    }
  };

  const handleConfirm = () => {
    onAddServers(selectedServers);
  };

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfileId(profileId);
    
    if (profileId) {
      const servers = getProfileServers(profileId);
      setSelectedServers(servers);
    } else {
      setSelectedServers([]);
    }
  };

  const handleRemoveServer = (serverId: string) => {
    setSelectedServers(selectedServers.filter(s => s.id !== serverId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add Servers to Host</DialogTitle>
          <DialogDescription>
            Select servers to add to this host or import from a profile.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          defaultValue="servers" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "servers" | "profile")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="servers">Select Servers</TabsTrigger>
            <TabsTrigger value="profile">Import from Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="servers" className="mt-4 space-y-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search servers..." 
                className="pl-8"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Server lists */}
            <div className="space-y-6">
              {/* Available servers section */}
              <div>
                <h3 className="text-sm font-medium mb-2">Available Servers</h3>
                <div className="border rounded-md overflow-hidden">
                  {filteredServers.length > 0 ? (
                    <ScrollArea className="h-[200px]">
                      <div className="p-1">
                        {filteredServers.map(server => {
                          const isSelected = selectedServers.some(s => s.id === server.id);
                          
                          return (
                            <div 
                              key={server.id} 
                              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer hover:bg-muted/50 ${isSelected ? 'bg-primary/10' : ''}`}
                              onClick={() => handleToggleServer(server)}
                            >
                              <Checkbox 
                                checked={isSelected}
                                onCheckedChange={() => handleToggleServer(server)}
                              />
                              <div className="flex-grow">
                                <div className="font-medium flex items-center gap-2">
                                  <Server className="h-4 w-4 text-muted-foreground" />
                                  {server.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {server.connectionDetails}
                                </div>
                              </div>
                              <EndpointLabel 
                                type={
                                  serverDefinitions.find(def => def.id === server.definitionId)?.type || "HTTP_SSE"
                                } 
                              />
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  ) : searchQuery ? (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">No servers matching "{searchQuery}"</p>
                      <Button variant="link" onClick={() => setSearchQuery("")}>Clear search</Button>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">No available servers found</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Discovery servers section */}
              <div>
                <h3 className="text-sm font-medium mb-2">Discover New Servers</h3>
                <div className="border rounded-md overflow-hidden">
                  {filteredDiscoveryServers.length > 0 ? (
                    <ScrollArea className="h-[200px]">
                      <div className="p-1">
                        {filteredDiscoveryServers.map(server => {
                          const isSelected = selectedServers.some(s => s.id === server.id);
                          
                          return (
                            <div key={server.id} className="p-3 border-b last:border-b-0">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-medium">{server.name}</div>
                                <div>
                                  {isSelected ? (
                                    <Badge className="bg-green-500">Added</Badge>
                                  ) : (
                                    <Button 
                                      size="sm" 
                                      variant="secondary"
                                      onClick={() => handleAddDiscoveryServer(server)}
                                    >
                                      <Plus className="h-3.5 w-3.5 mr-1" /> 
                                      Add
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {server.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <EndpointLabel type={server.type} />
                                {server.author && (
                                  <Badge variant="outline" className="text-xs">
                                    By {server.author}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  ) : searchQuery ? (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">No discovery servers matching "{searchQuery}"</p>
                      <Button variant="link" onClick={() => setSearchQuery("")}>Clear search</Button>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">No discovery servers available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="profile" className="mt-4 space-y-4">
            {profiles.length > 0 ? (
              <>
                <div className="space-y-1 mb-2">
                  <Label>Select a profile to import servers from</Label>
                  <p className="text-sm text-muted-foreground">
                    All servers from the selected profile will be added to this host
                  </p>
                </div>
                
                <RadioGroup value={selectedProfileId} onValueChange={handleProfileSelect}>
                  {profiles.map(profile => {
                    const serverCount = profile.instances.length;
                    
                    return (
                      <div key={profile.id} className="flex items-center space-x-2 border rounded-md p-3">
                        <input
                          type="radio"
                          id={profile.id}
                          value={profile.id}
                          checked={selectedProfileId === profile.id}
                          onChange={() => handleProfileSelect(profile.id)}
                          className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <Label 
                          htmlFor={profile.id} 
                          className="flex-grow flex items-center justify-between cursor-pointer"
                        >
                          <span className="font-medium">{profile.name}</span>
                          <div className="text-sm text-muted-foreground">
                            {serverCount} {serverCount === 1 ? 'server' : 'servers'}
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
                
                {selectedProfileId && profileServers.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Profile Servers</h4>
                    <div className="border rounded-md p-2">
                      <ScrollArea className="h-[150px]">
                        <div className="space-y-1">
                          {profileServers.map(server => (
                            <div key={server.id} className="p-2 text-sm flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Server className="h-4 w-4 text-muted-foreground" />
                                {server.name}
                              </div>
                              <EndpointLabel 
                                type={
                                  serverDefinitions.find(def => def.id === server.definitionId)?.type || "HTTP_SSE"
                                } 
                              />
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="border border-dashed rounded-md p-8 text-center space-y-2">
                <Info className="h-8 w-8 mx-auto text-muted-foreground" />
                <h4 className="font-medium">No Profiles Available</h4>
                <p className="text-muted-foreground">
                  You don't have any profiles created yet. Create a profile to import servers from.
                </p>
                <Button variant="outline" onClick={() => setActiveTab("servers")}>
                  Select servers individually
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Selected servers preview */}
        {selectedServers.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Selected Servers ({selectedServers.length})</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground h-8"
                onClick={() => setSelectedServers([])}
              >
                Clear
              </Button>
            </div>
            <ScrollArea className="h-[120px] border rounded-md">
              <div className="p-1">
                {selectedServers.map(server => (
                  <div 
                    key={server.id} 
                    className="flex items-center justify-between py-1.5 px-2 rounded-sm hover:bg-muted/50 group"
                  >
                    <div className="flex items-center gap-2">
                      <Server className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{server.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                      onClick={() => handleRemoveServer(server.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={selectedServers.length === 0}
          >
            Add {selectedServers.length} {selectedServers.length === 1 ? 'Server' : 'Servers'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
