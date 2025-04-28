
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronLeft, Search, X, Info } from "lucide-react";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { ServerInstance, serverDefinitions } from "@/data/mockData";

interface ServerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  servers: ServerInstance[];
  onSelectServer: (server: ServerInstance) => void;
  onCreateInstance: (server: ServerInstance) => void;
  onAddExistingInstance: (server: ServerInstance) => void;
  existingInstances: string[];
  onClose: () => void;
}

export function ServerSelectionDialog({
  open,
  onOpenChange,
  servers,
  onSelectServer,
  onCreateInstance,
  onAddExistingInstance,
  existingInstances,
  onClose
}: ServerSelectionDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyAdded, setShowOnlyAdded] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerInstance | null>(null);
  const [step, setStep] = useState<"list" | "config" | "instances">("list");
  
  // Filter servers based on search query and toggle
  const filteredServers = useMemo(() => {
    let filtered = servers;
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(server => 
        server.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (showOnlyAdded) {
      filtered = filtered.filter(server => 
        existingInstances.includes(server.id)
      );
    }
    
    return filtered;
  }, [servers, searchQuery, showOnlyAdded, existingInstances]);
  
  // Get associated instances for the selected server
  const serverInstances = useMemo(() => {
    if (!selectedServer) return [];
    
    return servers.filter(s => 
      s.definitionId === selectedServer.definitionId && 
      existingInstances.includes(s.id)
    );
  }, [selectedServer, servers, existingInstances]);
  
  const getServerType = (server: ServerInstance) => {
    const definition = serverDefinitions.find(def => def.id === server.definitionId);
    return definition?.type || "HTTP_SSE";
  };
  
  const handleServerSelect = (server: ServerInstance) => {
    setSelectedServer(server);
    
    // Check if this server already has instances
    const hasInstances = existingInstances.includes(server.id) || 
      servers.some(s => s.definitionId === server.definitionId && existingInstances.includes(s.id));
    
    if (hasInstances) {
      setStep("instances");
    } else {
      setStep("config");
      onSelectServer(server);
    }
  };
  
  const handleAddExistingInstance = (instance: ServerInstance) => {
    onAddExistingInstance(instance);
    handleClose();
  };
  
  const handleCreateInstance = () => {
    if (selectedServer) {
      onCreateInstance(selectedServer);
      handleClose();
    }
  };
  
  const handleGoBack = () => {
    if (step === "list") {
      onClose();
    } else {
      setStep("list");
      setSelectedServer(null);
    }
  };
  
  const handleClose = () => {
    setSearchQuery("");
    setShowOnlyAdded(false);
    setSelectedServer(null);
    setStep("list");
    onOpenChange(false);
  };
  
  const isServerAlreadyAdded = (serverId: string) => {
    return existingInstances.includes(serverId);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            {step !== "list" && (
              <Button variant="ghost" size="icon" onClick={handleGoBack}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle>
              {step === "list" && "Select Server"}
              {step === "config" && "Configure Server Instance"}
              {step === "instances" && "Select Existing Instance"}
            </DialogTitle>
          </div>
          
          {step === "list" && (
            <div className="flex items-center gap-3 text-sm">
              <Label htmlFor="show-added" className="cursor-pointer">
                Show only added
              </Label>
              <Switch 
                id="show-added" 
                checked={showOnlyAdded}
                onCheckedChange={setShowOnlyAdded}
              />
            </div>
          )}
        </DialogHeader>

        {step === "list" && (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search servers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8"
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

            {filteredServers.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <div className="text-3xl mb-2">🔍</div>
                <h3 className="text-lg font-medium">No servers found</h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? `No servers matching "${searchQuery}" were found` 
                    : showOnlyAdded 
                      ? "You haven't added any servers yet" 
                      : "No servers available"
                  }
                </p>
                {(searchQuery || showOnlyAdded) && (
                  <Button variant="outline" onClick={() => {
                    setSearchQuery("");
                    setShowOnlyAdded(false);
                  }}>Clear filters</Button>
                )}
              </div>
            ) : (
              <ScrollArea className="max-h-[50vh] pr-3">
                <div className="space-y-2">
                  {filteredServers.map(server => {
                    const isAdded = isServerAlreadyAdded(server.id);
                    return (
                      <div
                        key={server.id}
                        className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:border-primary/50 hover:bg-muted/30`}
                        onClick={() => handleServerSelect(server)}
                      >
                        <div className="bg-muted rounded-md p-1.5 flex-shrink-0">
                          {/* Server logo would go here */}
                          <Info className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{server.name}</p>
                            {isAdded && <Badge variant="outline">Added</Badge>}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <EndpointLabel type={getServerType(server)} />
                            <p className="text-xs text-muted-foreground truncate">
                              {server.description || "No description available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}

            <DialogFooter className="pt-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "instances" && selectedServer && (
          <>
            <div className="space-y-1 mb-3">
              <h3 className="font-medium">{selectedServer.name}</h3>
              <p className="text-sm text-muted-foreground">
                This server already has instances. Choose an existing instance or create a new one.
              </p>
            </div>
            
            <ScrollArea className="max-h-[50vh] pr-3">
              <div className="space-y-2 mb-4">
                {serverInstances.length > 0 ? serverInstances.map(instance => (
                  <div
                    key={instance.id}
                    className="flex items-center justify-between space-x-3 p-3 rounded-lg border cursor-pointer hover:border-primary/50 hover:bg-muted/30"
                    onClick={() => handleAddExistingInstance(instance)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-muted rounded-md p-1.5 flex-shrink-0">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{instance.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {instance.endpoint || "No endpoint specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No existing instances found
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="pt-2 border-t">
              <Button 
                className="w-full justify-center" 
                variant="outline"
                onClick={() => {
                  setStep("config");
                  onSelectServer(selectedServer);
                }}
              >
                Create New Instance
              </Button>
            </div>

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={handleGoBack}>
                Back
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "config" && selectedServer && (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="instance-name" className="mb-1.5 block">Instance Name</Label>
                <Input 
                  id="instance-name" 
                  defaultValue={selectedServer.name}
                  placeholder="Enter instance name"
                />
              </div>
              
              {getServerType(selectedServer) === "HTTP_SSE" && (
                <div>
                  <Label htmlFor="endpoint-url" className="mb-1.5 block">URL</Label>
                  <Input 
                    id="endpoint-url" 
                    placeholder="https://example.com/api"
                    defaultValue={selectedServer.endpoint || ""}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The URL endpoint for the server
                  </p>
                </div>
              )}
              
              {getServerType(selectedServer) !== "HTTP_SSE" && (
                <div>
                  <Label htmlFor="command-args" className="mb-1.5 block">Command Arguments</Label>
                  <Input 
                    id="command-args" 
                    placeholder="--port 8080 --config path/to/config"
                    defaultValue={selectedServer.commandArgs || ""}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Arguments to pass to the server command
                  </p>
                </div>
              )}
              
              <div>
                <Label className="mb-1.5 block">Environment Variables</Label>
                <div className="border rounded-md p-3 bg-muted/20">
                  <p className="text-sm text-muted-foreground italic">
                    No environment variables defined
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 text-xs">
                    Add Environment Variable
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-6 pt-2">
              <Button variant="outline" onClick={handleGoBack}>
                Back
              </Button>
              <Button onClick={handleCreateInstance}>
                Create Instance
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
