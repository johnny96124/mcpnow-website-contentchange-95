import React, { useState, useEffect } from "react";
import { 
  Search, X, Server, Plus, Check, ArrowLeft, ArrowRight, AlertTriangle, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { serverDefinitions, Profile, ServerInstance, EndpointType } from "@/data/mockData";

interface ServerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServers: (servers: ServerInstance[]) => void;
}

const availableServers: ServerInstance[] = [
  {
    id: "server-1",
    name: "GitHub Copilot",
    definitionId: "def-http-sse",
    status: "stopped",
    connectionDetails: "https://api.github.com/copilot",
    enabled: false
  },
  {
    id: "server-2",
    name: "Local File Assistant",
    definitionId: "def-stdio",
    status: "stopped",
    connectionDetails: "npx file-assistant",
    enabled: false
  },
  {
    id: "server-3",
    name: "OpenAI API",
    definitionId: "def-http-sse",
    status: "stopped",
    connectionDetails: "https://api.openai.com/v1",
    enabled: false
  },
  {
    id: "server-4",
    name: "Code Interpreter",
    definitionId: "def-ws",
    status: "stopped",
    connectionDetails: "ws://localhost:3000",
    enabled: false
  }
];

const existingInstances: ServerInstance[] = [
  {
    id: "instance-1",
    name: "GitHub Copilot Instance",
    definitionId: "def-http-sse",
    status: "stopped",
    connectionDetails: "https://api.github.com/copilot",
    enabled: false
  },
  {
    id: "instance-2",
    name: "Local File Assistant Dev",
    definitionId: "def-stdio",
    status: "stopped",
    connectionDetails: "npx file-assistant --dev",
    enabled: false
  }
];

const getServerDescription = (serverId: string): string => {
  const server = availableServers.find(s => s.id === serverId);
  if (!server) return "";
  
  const definition = serverDefinitions.find(d => d.id === server.definitionId);
  if (!definition) return "";
  
  return definition.type === "HTTP_SSE" 
    ? "HTTP-based server using Server-Sent Events" 
    : definition.type === "STDIO" 
      ? "Command-line based server using standard I/O"
      : "WebSocket-based server";
};

export const ServerSelectionDialog: React.FC<ServerSelectionDialogProps> = ({
  open,
  onOpenChange,
  onAddServers,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyWithInstances, setShowOnlyWithInstances] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [instances, setInstances] = useState<ServerInstance[]>(existingInstances);
  const [selectedInstanceIds, setSelectedInstanceIds] = useState<string[]>([]);
  
  const [step, setStep] = useState<"select" | "configure" | "instances">("select");
  const [newInstanceName, setNewInstanceName] = useState("");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [commandArgs, setCommandArgs] = useState("");
  const [envVariables, setEnvVariables] = useState("");
  
  useEffect(() => {
    if (!open) {
      setStep("select");
      setSelectedServerId(null);
      setSelectedInstanceIds([]);
      setSearchQuery("");
      setShowOnlyWithInstances(false);
      setNewInstanceName("");
      setEndpointUrl("");
      setCommandArgs("");
      setEnvVariables("");
    }
  }, [open]);
  
  useEffect(() => {
    if (selectedServerId) {
      const server = availableServers.find(s => s.id === selectedServerId);
      if (server) {
        setNewInstanceName(server.name);
        
        const definition = serverDefinitions.find(d => d.id === server.definitionId);
        if (definition && (definition.type === "HTTP_SSE" || definition.type === "WS")) {
          setEndpointUrl(server.connectionDetails);
          setCommandArgs("");
        } else {
          setEndpointUrl("");
          setCommandArgs(server.connectionDetails);
        }
      }
    }
  }, [selectedServerId]);
  
  const filteredServers = availableServers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (showOnlyWithInstances) {
      return matchesSearch && instances.some(i => i.definitionId === server.definitionId);
    }
    return matchesSearch;
  });
  
  const getServerInstances = (serverId: string) => {
    const server = availableServers.find(s => s.id === serverId);
    if (!server) return [];
    
    return instances.filter(i => i.definitionId === server.definitionId);
  };
  
  const handleServerSelect = (serverId: string) => {
    setSelectedServerId(serverId);
    const serverInstances = getServerInstances(serverId);
    
    if (serverInstances.length > 0) {
      setStep("instances");
    } else {
      setStep("configure");
    }
  };
  
  const handleCreateInstance = () => {
    const server = availableServers.find(s => s.id === selectedServerId);
    if (!server) return;
    
    const definition = serverDefinitions.find(d => d.id === server.definitionId);
    const isHttpType = definition && (definition.type === "HTTP_SSE" || definition.type === "WS");
    
    const newInstance: ServerInstance = {
      id: `instance-${Date.now()}`,
      name: newInstanceName,
      definitionId: server.definitionId,
      status: "stopped",
      connectionDetails: isHttpType ? endpointUrl : commandArgs,
      enabled: false
    };
    
    onAddServers([newInstance]);
    onOpenChange(false);
  };
  
  const handleAddInstances = () => {
    const selectedInstances = instances.filter(i => selectedInstanceIds.includes(i.id));
    onAddServers(selectedInstances);
    onOpenChange(false);
  };
  
  const getEndpointType = (definitionId: string): EndpointType => {
    const definition = serverDefinitions.find(d => d.id === definitionId);
    return definition?.type || "HTTP_SSE";
  };
  
  const renderServerSelectionStep = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 mr-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search servers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="show-with-instances"
            checked={showOnlyWithInstances}
            onCheckedChange={setShowOnlyWithInstances}
          />
          <Label htmlFor="show-with-instances">Show only with instances</Label>
        </div>
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {filteredServers.map(server => {
          const hasInstances = getServerInstances(server.id).length > 0;
          
          return (
            <div
              key={server.id}
              className="flex items-start p-4 border rounded-md hover:border-primary hover:bg-muted/20 cursor-pointer transition-colors"
              onClick={() => handleServerSelect(server.id)}
            >
              <div className="mr-3 bg-muted/20 p-2 rounded-md">
                <Server className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{server.name}</h4>
                  {hasInstances && (
                    <Badge variant="outline" className="text-xs">
                      Has Instances
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <EndpointLabel 
                    type={getEndpointType(server.definitionId)} 
                    className="text-[10px] px-1.5 py-0"
                  />
                  <span className="text-xs text-muted-foreground">
                    {getServerDescription(server.id)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredServers.length === 0 && (
          <div className="text-center py-8 border border-dashed rounded-md">
            <p className="text-muted-foreground">No matching servers found</p>
            {searchQuery && (
              <Button variant="link" className="mt-2" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
  
  const renderConfigureStep = () => {
    const selectedServer = availableServers.find(s => s.id === selectedServerId);
    if (!selectedServer) return null;
    
    const endpointType = getEndpointType(selectedServer.definitionId);
    const isHttpType = endpointType === "HTTP_SSE" || endpointType === "WS";
    
    return (
      <>
        <div className="mb-4">
          <Button 
            variant="ghost" 
            className="p-0 h-auto mb-2"
            onClick={() => setStep("select")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to servers
          </Button>
          <div className="flex items-center gap-2">
            <div className="bg-muted/20 p-2 rounded-md">
              <Server className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">
              {selectedServer.name}
            </h3>
            <EndpointLabel 
              type={getEndpointType(selectedServer.definitionId)}
              className="ml-2"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instance-name">Instance Name</Label>
            <Input 
              id="instance-name"
              value={newInstanceName}
              onChange={e => setNewInstanceName(e.target.value)}
              placeholder="Enter a name for this instance"
            />
          </div>
          
          {isHttpType ? (
            <div className="space-y-2">
              <Label htmlFor="endpoint-url">Endpoint URL</Label>
              <Input 
                id="endpoint-url"
                value={endpointUrl}
                onChange={e => setEndpointUrl(e.target.value)}
                placeholder="https://api.example.com"
              />
              <p className="text-xs text-muted-foreground">
                The URL endpoint for this server
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="command-args">Command Arguments</Label>
              <Input 
                id="command-args"
                value={commandArgs}
                onChange={e => setCommandArgs(e.target.value)}
                placeholder="e.g. npx server-name --option value"
              />
              <p className="text-xs text-muted-foreground">
                The command to run this server
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="env-variables">
              {isHttpType ? "HTTP Headers" : "Environment Variables"}
            </Label>
            <textarea
              id="env-variables"
              className="w-full min-h-[100px] rounded-md border border-input bg-transparent p-2 text-sm shadow-sm placeholder:text-muted-foreground"
              value={envVariables}
              onChange={e => setEnvVariables(e.target.value)}
              placeholder={isHttpType ? 
                "Authorization: Bearer token\nContent-Type: application/json" : 
                "API_KEY=your_key\nDEBUG=true"}
            />
            <p className="text-xs text-muted-foreground">
              {isHttpType ? 
                "Enter HTTP headers as key-value pairs, one per line" : 
                "Enter environment variables as key=value pairs, one per line"}
            </p>
          </div>
        </div>
      </>
    );
  };
  
  const renderInstancesStep = () => {
    const selectedServer = availableServers.find(s => s.id === selectedServerId);
    if (!selectedServer) return null;
    
    const serverInstances = getServerInstances(selectedServerId || "");
    
    return (
      <>
        <div className="mb-4">
          <Button 
            variant="ghost" 
            className="p-0 h-auto mb-2"
            onClick={() => setStep("select")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to servers
          </Button>
          <div className="flex items-center gap-2">
            <div className="bg-muted/20 p-2 rounded-md">
              <Server className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-medium">
                {selectedServer.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Select existing instances or create a new one
              </p>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">
              Existing Instances ({serverInstances.length})
            </TabsTrigger>
            <TabsTrigger value="create">Create New Instance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing" className="pt-4">
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {serverInstances.map(instance => (
                <div
                  key={instance.id}
                  className={`flex items-center justify-between p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedInstanceIds.includes(instance.id) 
                      ? "border-primary bg-primary/5" 
                      : "hover:border-primary/30 hover:bg-muted/20"
                  }`}
                  onClick={() => {
                    setSelectedInstanceIds(prev => 
                      prev.includes(instance.id)
                        ? prev.filter(id => id !== instance.id)
                        : [...prev, instance.id]
                    );
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-muted/20 p-1.5 rounded-md">
                      <Server className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{instance.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {instance.connectionDetails}
                      </p>
                    </div>
                  </div>
                  
                  <div className="h-5 w-5 border rounded-md flex items-center justify-center">
                    {selectedInstanceIds.includes(instance.id) && (
                      <Check className="h-3 w-3 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="create" className="pt-4">
            {renderConfigureStep()}
          </TabsContent>
        </Tabs>
      </>
    );
  };
  
  const renderStepContent = () => {
    switch (step) {
      case "select":
        return renderServerSelectionStep();
      case "configure":
        return renderConfigureStep();
      case "instances":
        return renderInstancesStep();
    }
  };

  const getDefinitionType = (definitionId: string): EndpointType => {
    const definition = serverDefinitions.find(d => d.id === definitionId);
    return definition?.type || 'HTTP_SSE';
  };

  const isHttpType = (type: EndpointType): boolean => {
    return type === 'HTTP_SSE' || type === 'WS';
  };
  
  const handleToggleServer = (server: ServerInstance) => {
    if (selectedServers.some(s => s.id === server.id)) {
      setSelectedServers(selectedServers.filter(s => s.id !== server.id));
    } else {
      setSelectedServers([...selectedServers, server]);
    }
  };

  const handleAddDiscoveryServer = (server: any) => {
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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {step === "select" 
              ? "Select Server" 
              : step === "configure" 
                ? "Configure Server Instance" 
                : "Select Instances"}
          </DialogTitle>
          <DialogDescription>
            {step === "select" 
              ? "Choose a server to add to your profile" 
              : step === "configure" 
                ? "Configure the server instance settings" 
                : "Choose existing instances or create a new one"}
          </DialogDescription>
        </DialogHeader>
        
        {renderStepContent()}
        
        <DialogFooter className="pt-2">
          {step === "select" && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
          
          {step === "configure" && (
            <>
              <Button variant="outline" onClick={() => setStep("select")}>
                Cancel
              </Button>
              <Button onClick={handleCreateInstance}>
                <Plus className="h-4 w-4 mr-2" />
                Create Instance
              </Button>
            </>
          )}
          
          {step === "instances" && (
            <>
              <Button variant="outline" onClick={() => setStep("select")}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddInstances}
                disabled={selectedInstanceIds.length === 0}
              >
                Add Selected Instances ({selectedInstanceIds.length})
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
