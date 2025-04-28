
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { serverDefinitions, type ServerInstance, type EndpointType, type Status } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface ServerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServers: (servers: ServerInstance[]) => void;
}

// Mock data with descriptions
const availableServers: Array<{
  id: string;
  name: string;
  definitionId: string;
  status: Status;
  connectionDetails: string;
  enabled: boolean;
  description: string;
  type: EndpointType;
}> = [
  {
    id: "server-1",
    name: "PostgreSQL Database",
    definitionId: "def-http-sse",
    status: "stopped",
    connectionDetails: "https://api.postgresql.org",
    enabled: false,
    description: "PostgreSQL database server with extended JSON-RPC API",
    type: "HTTP_SSE"
  },
  {
    id: "server-2",
    name: "Docker Assistant",
    definitionId: "def-stdio",
    status: "stopped",
    connectionDetails: "npx docker-assistant",
    enabled: false,
    description: "Helps manage Docker containers and images with intuitive interface",
    type: "STDIO"
  },
  {
    id: "server-3",
    name: "Redis Cache",
    definitionId: "def-http-sse",
    status: "stopped",
    connectionDetails: "https://redis.cache.local",
    enabled: false,
    description: "In-memory data structure store used as cache, database, and message broker",
    type: "HTTP_SSE"
  }
];

const existingInstances: ServerInstance[] = [
  {
    id: "instance-1",
    name: "Local PostgreSQL",
    definitionId: "def-http-sse",
    status: "stopped",
    connectionDetails: "https://localhost:5432",
    enabled: false
  },
  {
    id: "instance-2",
    name: "Development Redis",
    definitionId: "def-stdio",
    status: "stopped",
    connectionDetails: "redis://localhost:6379",
    enabled: false
  }
];

export const ServerSelectionDialog: React.FC<ServerSelectionDialogProps> = ({
  open,
  onOpenChange,
  onAddServers,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdded, setShowAdded] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [step, setStep] = useState<"selection" | "configure">("selection");
  const [serverConfig, setServerConfig] = useState({
    name: "",
    connectionUrl: "",
    additionalParams: ""
  });
  const { toast } = useToast();

  // Reset when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setShowAdded(false);
      setSelectedServer(null);
      setStep("selection");
      setServerConfig({
        name: "",
        connectionUrl: "",
        additionalParams: ""
      });
    }
  }, [open]);

  const handleServerSelect = (serverId: string) => {
    setSelectedServer(serverId);
    if (showAdded) {
      const server = existingInstances.find(s => s.id === serverId);
      if (server) {
        onAddServers([server]);
        toast({
          title: "Server added",
          description: `${server.name} has been added to your profile`
        });
        onOpenChange(false);
      }
    } else {
      // Go to configuration step for discovery servers
      const server = availableServers.find(s => s.id === serverId);
      if (server) {
        setServerConfig({
          name: server.name,
          connectionUrl: server.connectionDetails,
          additionalParams: ""
        });
        setStep("configure");
      }
    }
  };

  const handleConfigureServer = () => {
    if (!selectedServer) return;
    
    const server = availableServers.find(s => s.id === selectedServer);
    if (server) {
      const newInstance: ServerInstance = {
        id: `new-${Date.now()}`,
        name: serverConfig.name || server.name,
        definitionId: server.definitionId,
        status: "stopped" as Status,
        connectionDetails: serverConfig.connectionUrl || server.connectionDetails,
        enabled: false
      };
      
      onAddServers([newInstance]);
      toast({
        title: "Server added",
        description: `${newInstance.name} has been added to your profile`
      });
      onOpenChange(false);
    }
  };

  const filteredServers = showAdded
    ? existingInstances.filter(server =>
        server.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableServers.filter(server =>
        server.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {step === "selection" ? "Select Server" : "Configure Server"}
          </DialogTitle>
          <DialogDescription>
            {step === "selection" 
              ? "Choose a server to add to your profile" 
              : "Configure the server settings before adding"}
          </DialogDescription>
        </DialogHeader>

        {step === "selection" ? (
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
            
            <div className="flex items-center space-x-2">
              <Switch
                id="show-added"
                checked={showAdded}
                onCheckedChange={setShowAdded}
              />
              <Label htmlFor="show-added">Show Added Only</Label>
            </div>

            <div className="space-y-4">
              {filteredServers.map((server) => (
                <div
                  key={server.id}
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:border-primary hover:bg-accent/5 cursor-pointer transition-colors"
                  onClick={() => handleServerSelect(server.id)}
                >
                  <ServerLogo name={server.name} className="flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{server.name}</h4>
                      {'type' in server && (
                        <EndpointLabel type={server.type} />
                      )}
                      {showAdded && (
                        <Badge variant="secondary">Added</Badge>
                      )}
                    </div>
                    {'description' in server && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {server.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {server.connectionDetails}
                    </p>
                  </div>
                </div>
              ))}

              {filteredServers.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <p className="text-muted-foreground">No servers found</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              onClick={() => {
                setStep("selection");
                setSelectedServer(null);
              }}
              className="mb-4 -ml-2"
            >
              ← Back to selection
            </Button>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="server-name">Server Name</Label>
                <Input
                  id="server-name"
                  value={serverConfig.name}
                  onChange={(e) => setServerConfig({...serverConfig, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="connection-url">Connection URL</Label>
                <Input
                  id="connection-url"
                  value={serverConfig.connectionUrl}
                  onChange={(e) => setServerConfig({...serverConfig, connectionUrl: e.target.value})}
                  placeholder="e.g. https://api.example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additional-params">Additional Parameters (optional)</Label>
                <Input
                  id="additional-params"
                  value={serverConfig.additionalParams}
                  onChange={(e) => setServerConfig({...serverConfig, additionalParams: e.target.value})}
                  placeholder="Any additional configuration"
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {step === "selection" ? (
            <Button disabled={selectedServer === null && !showAdded}>
              {showAdded ? "Add Selected" : "Next"}
            </Button>
          ) : (
            <Button 
              onClick={handleConfigureServer}
              disabled={!serverConfig.name || !serverConfig.connectionUrl}
            >
              Add Server
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
