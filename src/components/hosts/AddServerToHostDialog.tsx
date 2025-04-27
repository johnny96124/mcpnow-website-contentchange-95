
import { useState } from "react";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, X, Plus, FolderPlus, Server, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ServerDefinition, serverDefinitions, ServerInstance, serverInstances } from "@/data/mockData";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

interface AddServerToHostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServers: (servers: ServerDefinition[]) => void;
}

export function AddServerToHostDialog({ open, onOpenChange, onAddServers }: AddServerToHostDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("list");
  const [selectedServers, setSelectedServers] = useState<ServerDefinition[]>([]);
  const [useDiscovery, setUseDiscovery] = useState(false);
  const [selectedInstances, setSelectedInstances] = useState<string[]>([]);

  const handleServerSelect = (server: ServerDefinition) => {
    if (!selectedServers.find(s => s.id === server.id)) {
      setSelectedServers([...selectedServers, server]);
    }
  };

  const handleInstanceToggle = (instanceId: string) => {
    setSelectedInstances(prev => 
      prev.includes(instanceId) 
        ? prev.filter(id => id !== instanceId)
        : [...prev, instanceId]
    );
  };

  const handleServerRemove = (serverId: string) => {
    setSelectedServers(selectedServers.filter(s => s.id !== serverId));
  };

  const handleInstanceRemove = (instanceId: string) => {
    setSelectedInstances(prev => prev.filter(id => id !== instanceId));
  };

  const handleAddServers = () => {
    if (useDiscovery) {
      onAddServers(selectedServers);
    } else {
      // Convert selected instance IDs to server definitions
      const serverDefsFromInstances = selectedInstances.map(instanceId => {
        const instance = serverInstances.find(i => i.id === instanceId);
        if (!instance) return null;
        
        const serverDef = serverDefinitions.find(def => def.id === instance.definitionId);
        return serverDef || null;
      }).filter(Boolean) as ServerDefinition[];
      
      onAddServers(serverDefsFromInstances);
    }
    
    setSelectedServers([]);
    setSelectedInstances([]);
    onOpenChange(false);
  };

  const handleDialogClose = () => {
    setSelectedServers([]);
    setSelectedInstances([]);
    setSearchQuery("");
    setSelectedTab("list");
    setUseDiscovery(false);
    onOpenChange(false);
  };

  const filteredServers = serverDefinitions.filter(server => 
    server.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInstances = serverInstances.filter(instance =>
    instance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    serverDefinitions.find(def => def.id === instance.definitionId)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const collections = [
    {
      id: "core",
      name: "Core Services",
      servers: serverDefinitions.slice(0, 3)
    },
    {
      id: "data",
      name: "Data Services",
      servers: serverDefinitions.slice(3, 4)
    }
  ];

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Configure Host Services</DialogTitle>
          <DialogDescription>
            Add services to your host by selecting from existing instances or discovering new services.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 py-4">
          <div className="flex flex-1 items-center space-x-2">
            <Label htmlFor="use-discovery" className={useDiscovery ? "text-muted-foreground" : "font-medium"}>
              Use Existing Instances
            </Label>
            <Switch
              id="use-discovery"
              checked={useDiscovery}
              onCheckedChange={setUseDiscovery}
            />
            <Label htmlFor="use-discovery" className={!useDiscovery ? "text-muted-foreground" : "font-medium"}>
              Discover New Services
            </Label>
          </div>
        </div>

        {useDiscovery ? (
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">
                <Plus className="w-4 h-4 mr-2" />
                Service List
              </TabsTrigger>
              <TabsTrigger value="collections">
                <FolderPlus className="w-4 h-4 mr-2" />
                From Collections
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <ScrollArea className="h-[300px]">
                {filteredServers.length > 0 ? (
                  <div className="space-y-2">
                    {filteredServers.map((server) => (
                      <Card key={server.id} className="cursor-pointer hover:bg-accent">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {server.icon && <span>{server.icon}</span>}
                            <div>
                              <p className="font-medium">{server.name}</p>
                              <p className="text-sm text-muted-foreground">{server.description}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleServerSelect(server)}
                            disabled={selectedServers.some(s => s.id === server.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No services found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your search terms</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="collections" className="mt-4">
              <ScrollArea className="h-[300px]">
                {collections.map((collection) => (
                  <div key={collection.id} className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{collection.name}</h3>
                      <Badge variant="secondary">{collection.servers.length} services</Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mb-2"
                      onClick={() => {
                        const newServers = collection.servers.filter(
                          server => !selectedServers.some(s => s.id === server.id)
                        );
                        setSelectedServers([...selectedServers, ...newServers]);
                      }}
                    >
                      Add all services from this collection
                    </Button>
                    <div className="space-y-2">
                      {collection.servers.map((server) => (
                        <Card key={server.id} className="cursor-pointer hover:bg-accent">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {server.icon && <span>{server.icon}</span>}
                              <div>
                                <p className="font-medium">{server.name}</p>
                                <p className="text-sm text-muted-foreground">{server.description}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleServerSelect(server)}
                              disabled={selectedServers.some(s => s.id === server.id)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search existing instances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <ScrollArea className="h-[300px] border rounded-md">
              {filteredInstances.length > 0 ? (
                <div className="p-2 space-y-1">
                  {filteredInstances.map((instance) => {
                    const definition = serverDefinitions.find(d => d.id === instance.definitionId);
                    return (
                      <div 
                        key={instance.id} 
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent"
                      >
                        <Checkbox
                          id={`instance-${instance.id}`}
                          checked={selectedInstances.includes(instance.id)}
                          onCheckedChange={() => handleInstanceToggle(instance.id)}
                        />
                        <div className="flex-1">
                          <label 
                            htmlFor={`instance-${instance.id}`} 
                            className="flex items-center cursor-pointer"
                          >
                            <Server className="h-4 w-4 mr-2 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-sm">{instance.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {definition?.name || "Unknown type"} | {instance.connectionDetails}
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <Server className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No instances found</p>
                  {searchQuery ? (
                    <Button 
                      variant="link" 
                      className="mt-2 h-auto p-0"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      Try adding some servers first
                    </p>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
        )}

        {(selectedServers.length > 0 || selectedInstances.length > 0) && (
          <>
            <Separator className="my-4" />
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">
                  {useDiscovery ? "Selected Services" : "Selected Instances"}
                </h3>
                <Badge>
                  {useDiscovery ? selectedServers.length : selectedInstances.length}
                </Badge>
              </div>
              <ScrollArea className="max-h-[100px]">
                <div className="flex flex-wrap gap-2">
                  {useDiscovery ? (
                    selectedServers.map((server) => (
                      <Badge
                        key={server.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {server.name}
                        <button
                          onClick={() => handleServerRemove(server.id)}
                          className="ml-1 hover:bg-background/20 rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    selectedInstances.map((instanceId) => {
                      const instance = serverInstances.find(i => i.id === instanceId);
                      return (
                        <Badge
                          key={instanceId}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {instance?.name || "Unknown"}
                          <button
                            onClick={() => handleInstanceRemove(instanceId)}
                            className="ml-1 hover:bg-background/20 rounded-full p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </div>
          </>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddServers}
            disabled={(useDiscovery && selectedServers.length === 0) || (!useDiscovery && selectedInstances.length === 0)}
          >
            {useDiscovery ? "Add Services" : "Add Selected Instances"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
